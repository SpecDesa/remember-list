"use client";
import { useEffect, useState } from "react";
import {
  getItemsFromList,
  updateItemBoughtFromList,
  updateItemQuantityFromList,
  deleteItemFromList,
} from "./liste-server";
import { type ItemType } from "~/server/db/types";
import { Checkbox } from "~/components/ui/checkbox";
import ExpandableButton from "./expandable-button";
import { useIndexStore } from "~/stores/global-store";
import { Button } from "~/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import GoToButton from "../go-to-button";
import { URLS } from "~/app/_urls/urls";
import { usePathname, useSearchParams } from "next/navigation";
import { pusherClient } from "~/server/pusher/pusherClient";

const ListeClientBuy: React.FC = ({}) => {
  const [data, setData] = useState<ItemType[]>();
  const [showBought, setShowBought] = useState<boolean>(false);
  // is type Item - but mismatching id types of number and string...
  const [boughtItems, setBoughtItems] = useState<
    {
      id: number;
      name: string | null;
      quantity: number;
      bought: boolean | null;
    }[]
  >([]);
  const searchParams = useSearchParams();
  const path = usePathname();
  const {
    items,
    addItem,
    removeItem,
    toggleBought,
    increaseQuantity,
    decreaseQuantity,
    setUrlOnSuccess,
    setListId,
    setQuantity,
    listId,
  } = useIndexStore();


  useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat-lists")
      .bind("evt::list-update", (data: { listId: number; type: string, itemId: number, itemName: string, quantity?: number }) => {
        const { listId, type, itemId, itemName } = data;
        if (type === "delete-item") {
          removeItem(itemId);
              // setData((prevData) => prevData?.filter(item => item.id !== itemId));
        }
        if (type === "added-item") {
          // console.log("Hello", data )
          const newDate = new Date();
              const aNewItem: ItemType = {
                listsId: listId,
                name: itemName,
                quantity: 1,
                id: -1,
                threshold: -1,
                createdAt: newDate,
                lastPurchased: newDate,
                timeThreshold: "",
                updatedAt: newDate,
                bought: null,
                archived: false
              }

              setData((prevData) => {
                return prevData ? [ aNewItem, ...prevData] : [aNewItem];
              })
        }
        // If quantity change.. 
        if(type === 'quantity'){
          if(data.listId === listId){
            if(data.itemId && data.quantity){
              setQuantity(data.itemId, data.quantity);
            }

          }
        }
      })
      
      
    return () => {
      channel.unbind();
      pusherClient.unsubscribe("private-chat-lists");
    };
  }, []);

  // Set listId and succes url for other actions.
  useEffect(() => {
    const listId = Number(searchParams.get("listId"));
    const action = searchParams.get("action");
    // console.log(`${path}?listId=${listId}&action=${action}`);
    setUrlOnSuccess(`${path}?listId=${listId}&action=${action}`);
  }, [path, searchParams, setUrlOnSuccess]);

  // Fetch and set data from db on first load.
  useEffect(() => {
    const fetchData = async () => {
      // Fetch data when component mounts
      const listId = Number(searchParams.get("listId"));
      if (listId) {
        setListId(listId);
        const fetchedData = await getItemsFromList({ listId: listId });
        // Setting data fetched from db
        setData(fetchedData.filter((item) => item.bought !== true));
        setBoughtItems(fetchedData.filter((item) => item.bought));
      }
    };

    void fetchData();
    return () => {
      // cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add data to store, to manipulate view. f
  useEffect(() => {
    if (!data) {
      return;
    }

    for (const dataItem of data) {
      if (
        dataItem?.name &&
        !items.find((item) => item.id === dataItem.id)
      ) {
        addItem(dataItem.id, dataItem?.name, dataItem?.quantity);
      }
    }

    // Include bought items
    for (const dataItem of boughtItems) {
      if (
        dataItem?.name &&
        !items.find((item) => item.id === dataItem.id)
      ) {
        addItem(dataItem.id, dataItem?.name, dataItem?.quantity, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  // If quantity set to 0, remove from list. 
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const deleteItems = items.filter(item => item.quantity <= 0 ? item : undefined).filter(notUndef => notUndef)
      
      for(const item of deleteItems){
        if(item.id){
          deleteItemFromList({listId: listId, id: item.id});
          removeItem(item.id);
          notifyDelete({itemId: item.id});
        }
      }
    }, 2000);

    return () => clearTimeout(debounceTimeout);
  }, [items])

  // // update quantity to db after timeout
  useEffect(() => {
    if (!data) return;
    // let debounceTimeout: NodeJS.Timeout;

    const debounceTimeout = setTimeout(() => {
      for (const item of data) {
        const compareItem = items.find((it) => it.id === item.id);
        if (!compareItem) continue;

        // if removing item, dont do anything.
        if(compareItem.quantity <= 0){
          return;
        }

        if (compareItem.quantity !== item.quantity) {
          // Call queries to update
          void updateItemQuantityFromList({
            id: item.id,
            quantity: compareItem.quantity,
          }).then(async () => {
            const listId = Number(searchParams.get("listId"));
            const fetchedData = await getItemsFromList({ listId: listId });
            setData(fetchedData);
            notifyQuantityUpdate({itemId: compareItem.id, quantity: compareItem.quantity});
          });
        }
      }
    }, 1250);

    return () => clearTimeout(debounceTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);


  const notifyQuantityUpdate = async ({itemId, quantity}: {itemId: number, quantity:number}) => {
    return await fetch("/api/pusher/communication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "quantity",
        listId: listId,
        itemId: itemId,
        quantity: quantity
      }),
    });
  }

  const notifyDelete = async ({itemId}: {itemId: number}) => {
    return await fetch("/api/pusher/communication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "delete-item",
        listId: listId,
        itemId: itemId,
      }),
    });
  }

  // Add "tilføj button"
  const addItemDiv = () => {
    return (
      <div className="">
        <GoToButton text="Tilføj" url={`${URLS.ADD_ITEMS}?`} />
      </div>
    );
  };

  return (
    <div className="my-4 flex flex-col items-center justify-center ">
      <div className="mb-4 text-2xl">Shoppingliste</div>
      <div className="">
      {items ? (
        items.length === 0 ? (
          <div>Listen er tom</div>
        ) : items.every(item => item.bought === true) ? (
          <div>All varer er krydset af</div>
        ) : (
            items
              .filter((dataitem) => dataitem.bought !== true)

              .map((local, index) => {
                const currentStoreItem = items.find(
                  (item) => item.id === local.id,
                );

                if (!currentStoreItem) {
                  return undefined;
                }

                return (
                  <div
                    key={local.id}
                    className={
                      "my-4 w-80 min-w-48 rounded-md border border-yellow-800 p-4 shadow md:min-w-96"
                    }
                  >
                    <div className="grid grid-cols-3 items-center gap-2 md:grid-cols-5">
                      <div className="col-span-1 flex justify-start md:col-span-2 ">
                        <ExpandableButton
                          displayTextBefore={local?.quantity}
                          displayTextAfter={currentStoreItem.quantity}
                          increaseFunc={() =>{

                            increaseQuantity(currentStoreItem.id)
                          }
                          }
                          decreaseFunc={() =>
                            decreaseQuantity(currentStoreItem.id)
                          }
                          removeFunc={() => removeItem(currentStoreItem.id)}
                        />
                        {/* <div>{items.filter(item => item.name === local.name).at(0)?.quantity  }</div> */}
                      </div>
                      <div className="col-span-1  flex items-center justify-center md:col-span-2 ">
                        {local.name}
                      </div>
                      <div className="flex justify-end md:col-span-1 ">
                        <Checkbox
                          id="terms1"
                          className="size-6"
                          checked={local.bought}
                          onClick={() => {
                            if (
                              local?.bought !== undefined &&
                              local.bought !== null
                            ) {
                              void updateItemBoughtFromList({
                                id: local.id,
                                bought: true,
                              }).then(async () => {
                                const listId = Number(
                                  searchParams.get("listId"),
                                );
                                const fetchedData = await getItemsFromList({
                                  listId: listId,
                                });
                                setData(fetchedData);
                              });
                            }

                            toggleBought(currentStoreItem.id);
                            setBoughtItems((prevData) => {
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
                              return prevData
                                ? [
                                    local,
                                    ...prevData.filter(
                                      (item) => item.name !== local.name,
                                    ),
                                  ]
                                : [local];
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
              .filter((notUndefined) => notUndefined)
          )
        ) : (
          <div>Henter liste</div>
        )}
      </div>
      <div className="h-[10vh] content-end">{addItemDiv()}</div>
      <div className="my-8 mb-4 text-xl hover:cursor-pointer md:hover:bg-gray-300">
        <Button
          variant={"ghost"}
          onClick={() => setShowBought((prev) => !prev)}
        >
          Vis købte varer
          {showBought ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {showBought &&
        boughtItems.length > 0 &&
        boughtItems.map((local, index) => {
          const currentStoreItem = items.find(
            (item) => item.name === local?.name,
          );
          if (!currentStoreItem) {
            return undefined;
          }

          return (
            <div
              key={local?.id}
              className={
                "my-4 w-80 min-w-48 rounded-md border border-yellow-800 p-4 shadow md:min-w-96"
              }
            >
              <div
                className={`grid grid-cols-3 items-center gap-2 md:grid-cols-5`}
              >
                <div className="col-span-1 flex justify-start md:col-span-2 ">
                  <ExpandableButton
                    key={local?.id + "_" + index}
                    displayTextBefore={currentStoreItem?.quantity}
                    displayTextAfter={currentStoreItem?.quantity}
                    increaseFunc={() => {
                      increaseQuantity(currentStoreItem.id);
                    }}
                    decreaseFunc={() => {
                      decreaseQuantity(currentStoreItem.id);
                    }}
                    removeFunc={() => () => {
                      console.log(123);
                    }}
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center md:col-span-2 ">
                  {local?.name}
                </div>

                <div className="flex justify-end md:col-span-1 ">
                  <Checkbox
                    id="terms1"
                    className="size-6"
                    checked
                    onClick={async () => {
                      setBoughtItems((prevData) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
                        return prevData.filter((item) => item !== local);
                      });
                      const fetchedData = await getItemsFromList({
                        listId: listId,
                      });
                      const modifiedData = fetchedData.map((item) => {
                        if (local.id === item.id) {
                          item.bought = false;
                        }

                        return item;
                      });
                      toggleBought(local.id);
                      void updateItemBoughtFromList({
                        id: local.id,
                        bought: !local.bought,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ListeClientBuy;


