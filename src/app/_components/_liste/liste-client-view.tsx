"use client";
// import { getItems } from "~/server/db/queries";
import { useEffect, useState } from "react";
import {getItemsFromList, updateItemFromList} from "./liste-server";
import { type ItemType } from "~/server/db/types";
import { usePathname, useSearchParams } from "next/navigation";
import ExpandableButton from "./expandable-button";
import { useIndexStore } from "~/stores/global-store";
import GoToButton from "../go-to-button";
import { URLS } from "~/app/_urls/urls";
import { useUser } from "@clerk/nextjs";
import Swipeable from "../swipeable";
import { pusherClient } from "~/server/pusher/pusherClient";


const ListeClientView: React.FC = ({}) => {
  const userInfo = useUser();
  const path = usePathname();
  const [data, setData] = useState<ItemType[]>();
  const searchParams = useSearchParams();
  const {
    items,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    addListItem,
    listItems,
    setUrlOnSuccess,
    setListId,
    listId
  } = useIndexStore();


  useEffect(()  => {
    
    const listId = Number(searchParams.get("listId"));
    const action = searchParams.get("action");
    setUrlOnSuccess(`${path}?listId=${listId}&action=${action}`);
    //
    
  }, [path, searchParams, setUrlOnSuccess])

  useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat-lists")
      .bind("evt::list-update", (data: { listId: number; type: string, itemId: number, itemName: string }) => {
        const { listId, type, itemId, itemName } = data;
        if (type === "delete-item") {
              setData((prevData) => prevData?.filter(item => item.id !== itemId));
        }
        if (type === "added-item") {
          // console.log("Hello", data )
          const newDate = new Date();
              const aNewItem: ItemType = {
                listsId: listId,
                name: itemName, 
                quantity:0,
                id: -1,
                threshold: -1,
                createdAt: newDate,
                lastPurchased: newDate,
                timeThreshold: "",
                updatedAt: newDate,
              }

              setData((prevData) => {
                return prevData ? [ aNewItem, ...prevData] : [aNewItem];
              })
            

        }
      })
      
      
    return () => {
      channel.unbind();
      pusherClient.unsubscribe("private-chat-lists");
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data when component mounts
      const listId = Number(searchParams.get("listId"));
      if (listId) {
        setListId(listId);
        const fetchedData = await getItemsFromList({ listId: listId });
        setData(fetchedData);
        
      }
    };

    void fetchData();
    return () => {
      // cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect (() => {
    const listId = searchParams.get("listId");
    const id = userInfo?.user?.id;
    if(listId && id &&  !listItems.find((item) => item.listId === listId && item.userId === id)){
      addListItem(id, listId)
    }

  }, [userInfo.isLoaded, searchParams, userInfo?.user?.id, addListItem, listItems])

  useEffect(() => {
    if (!data) {
      return;
    }
    for (const dataItem of data) {
      if (
        dataItem?.name &&
        !items.find((item) => item.name === dataItem.name)
      ) {
        addItem(dataItem?.name, dataItem?.quantity);
      }
    }
  }, [addItem, data, items]);



  useEffect(() => {
    if (!data) return;
    // let debounceTimeout: NodeJS.Timeout;

    const debounceTimeout = setTimeout(() => {
      for (const item of data) {
        const compareItem = items.find((it) => it.name === item.name);
        if (!compareItem) continue;

        if (compareItem.quantity !== item.quantity) {
          // Call queries to update
          void updateItemFromList({ id: item.id, quantity: compareItem.quantity }).then(async () => {
            const listId = Number(searchParams.get("listId"));
            const fetchedData = await getItemsFromList({ listId: listId });
            setData(fetchedData);
          })
        }
      }
    }, 1250);

    return () => clearTimeout(debounceTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const addItemDiv = () => {
    return  <div className="">
    <GoToButton
      text="Tilføj ny ting"
      url={`${URLS.ADD_ITEMS}?`}
    />
  </div>
  }

  return (
    <div className="" >
      <div className="ms-8 text-2xl">Varebeholdning</div>
    <div className="my-4 flex flex-col items-center justify-center relative h-[70vh]" >
    <div className="items-center justify-center h-[1100px] ms-10 pe-16 w-2/3 overflow-y-auto" >
      <div className="">
        {data ? (
          data.length === 0 ? (
            <div>Listen er tom</div>
          ) : (
            data
    .map((local, index) => {
      const currentStoreItem = items.find((item) => item.name === local.name);
      if (!currentStoreItem) {
        return undefined;
      }

      return (
        <Swipeable
          key={`${index}_local`}
          // deleteButton={<button onClick={() => removeItem(currentStoreItem.id)}>Delete</button>}
          signalFullLeftSwipe={async () => {
            removeItem(currentStoreItem.id);
            const itemResp = await fetch("/api/list-items", {
              method: "DELETE",
              body: JSON.stringify({ listId, itemId: local.id }),
            });
            if (itemResp.status === 200) {
              await fetch("/api/pusher/communication", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "delete-item",
                  listId: local.listsId,
                  itemId: local.id,
                }),
              });
            }

          }}
        >
          <div className="my-4 min-w-56 rounded-md border border-yellow-800 p-4 shadow md:min-w-96">
            <div className="grid grid-cols-4 items-center gap-2 md:grid-cols-5">
              <div className="col-span-3 flex justify-start md:col-span-3">
                {local.name}
              </div>
              <div className="col-span-1 flex-wrap flex justify-end md:justify-end md:col-span-2 max-w-10 md:max-w-full">
                <ExpandableButton
                  displayTextBefore={currentStoreItem.quantity}
                  displayTextAfter={currentStoreItem.quantity}
                  increaseFunc={() => increaseQuantity(currentStoreItem.id)}
                  decreaseFunc={() => decreaseQuantity(currentStoreItem.id)}
                  removeFunc={() => removeItem(currentStoreItem.id)}
                />
              </div>
            </div>
          </div>
        </Swipeable>
      );
    })
    // .filter((notUndefined) => notUndefined);
  )
            // data
            //   .map((local, index) => {
            //     const currentStoreItem = items.find(
            //       (item) => item.name === local.name,
            //     );
            //     if (!currentStoreItem) {
            //       return undefined;
            //     }

            //     return (
            //       <div
            //         key={`${index}_local`}
            //         className={
            //           "my-4 min-w-56 rounded-md border border-yellow-800 p-4 shadow md:min-w-96"
            //         }
            //       >
            //         <div className="grid grid-cols-4 items-center gap-2 md:grid-cols-5">
            //           <div className="col-span-3 flex justify-start md:col-span-3 ">
            //             {local.name}
            //           </div>

            //           <div className="col-span-1 flex-wrap flex justify-end md:justify-end md:col-span-2 max-w-10 md:max-w-full ">
            //             <ExpandableButton
            //               displayTextBefore={currentStoreItem.quantity}
            //               displayTextAfter={currentStoreItem.quantity}
            //               increaseFunc={() =>
            //                 increaseQuantity(currentStoreItem.id)
            //               }
            //               decreaseFunc={() =>
            //                 decreaseQuantity(currentStoreItem.id)
            //               }
            //               removeFunc={() => removeItem(currentStoreItem.id)}
            //             />
            //           </div>
            //         </div>
            //       </div>
            //     );
            //   })
            //   .filter((notUndefined) => notUndefined)
          // )
        ) : (
          <div>Henter liste</div>
        )}
      </div>

    </div>
      <div className="h-[50vh] content-end">
      {addItemDiv()}
      </div>
    </div>
    </div>
  );
};

export default ListeClientView;
