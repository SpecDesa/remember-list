"use client";
// import { getItems } from "~/server/db/queries";
import { useEffect, useState } from "react";
import { getItemsFromList } from "./liste-server";
import { type ItemType } from "~/server/db/types";
import { Checkbox } from "~/components/ui/checkbox";
import ExpandableButton from "./expandable-button";
import { useIndexStore } from "~/stores/global-store";
import { Button } from "~/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import GoToButton from "../go-to-button";
import { URLS } from "~/app/_urls/urls";
import { usePathname, useSearchParams } from "next/navigation";
import { Item } from "~/stores/item-store";

const ListeClientBuy: React.FC = ({}) => {
  const [data, setData] = useState<ItemType[]>();
  const [showBought, setShowBought] = useState<boolean>(false);
  const [boughtItems, setBoughtItems] = useState<Item[]>([]);
  const searchParams = useSearchParams();
  const path = usePathname();
  const {
    items,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    setUrlOnSuccess,
    setListId
  } = useIndexStore();


  useEffect(() => {
    const listId = Number(searchParams.get("listId"));
    const action = searchParams.get("action");
    console.log(`${path}?listId=${listId}&action=${action}`);
    setUrlOnSuccess(`${path}?listId=${listId}&action=${action}`);
  }, [path, searchParams, setUrlOnSuccess])


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

  const addItemDiv = () => {
    return  <div className="">
    <GoToButton
      text="Tilføj"
      url={`${URLS.ADD_ITEMS}?`}
    />
  </div>
  }

  return (
    <div className="my-4 flex flex-col items-center justify-center">
      <div className="mb-4 text-2xl">At købe</div>
      <div className="">
        {data ? (
          data.length === 0 ? (
            <div>Listen er tom</div>
          ) : (
            data
              .map((local, index) => {
                const currentStoreItem = items.find(
                  (item) => item.name === local.name,
                );
                if (!currentStoreItem) {
                  return undefined;
                }

                return (
                  <div
                    key={`${index}_local`}
                    className={
                      "my-4 min-w-48 rounded-md border border-yellow-800 p-4 shadow md:min-w-96"
                    }
                  >
                    <div className="grid grid-cols-3 items-center gap-2 md:grid-cols-5">
                      <div className="col-span-1 flex justify-start md:col-span-2 ">
                        <ExpandableButton
                          displayTextBefore={currentStoreItem.quantity}
                          displayTextAfter={currentStoreItem.quantity}
                          increaseFunc={() =>
                            increaseQuantity(currentStoreItem.id)
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
                        <Checkbox id="terms1" className="size-6" onClick={() => {
                          console.log(local)
                          // setBoughtItems((prev))
                          setBoughtItems((prevData) => {
                            return prevData ? [local, ...prevData] : [local];
                          })
                        }}/>
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
      <div className="h-[50vh] content-end">
      {addItemDiv()}
      </div>
      <div className="mb-4 my-12 text-xl hover:cursor-pointer md:hover:bg-gray-300">
        <Button variant={"ghost"} onClick={() => setShowBought((prev) => !prev)}>
          Vis købte varer
          {showBought ? 
          <ChevronUp/>:
          <ChevronDown/>
          }
        </Button>

      </div>
    </div>
  );
};

export default ListeClientBuy;
