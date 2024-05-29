"use client";
// import { getItems } from "~/server/db/queries";
import { useEffect, useState } from "react";
import {getItemsFromList, updateItemFromList} from "./liste-server";
import { type ItemType } from "~/server/db/types";
import { useSearchParams } from "next/navigation";
import ExpandableButton from "./expandable-button";
import { useIndexStore } from "~/stores/global-store";
import { updateItemQuantity } from "~/server/db/queries";

const ListeClientView: React.FC = ({}) => {
  const [data, setData] = useState<ItemType[]>();
  const searchParams = useSearchParams();
  const {
    items,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useIndexStore();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data when component mounts
      const listId = Number(searchParams.get("listId"));
      if (listId) {
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


  return (
    <div className="my-4 flex flex-col items-center justify-center">
      <div className="mb-4 text-2xl">Varebeholdning</div>
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
                    <div className="grid grid-cols-4 items-center gap-2 md:grid-cols-5">
                      <div className="col-span-3 flex justify-start md:col-span-3 ">
                        {local.name}
                      </div>

                      <div className="col-span-1 flex-wrap flex justify-end md:justify-end md:col-span-2 max-w-10 md:max-w-full ">
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
    </div>
  );
};

export default ListeClientView;
