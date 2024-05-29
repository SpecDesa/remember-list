'use client';
import { ScrollArea } from "~/components/ui/scroll-area";
import { type RelatedUser} from "~/server/db/queries";
import GetAvatar from "./get-avatar";
import { URLS } from "../_urls/urls";
import GoToButton from "./go-to-button";
import { useEffect, useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { ListStatus } from "~/server/db/types";
import { ListAction } from "../(lister)/lister/page";
export const dynamic = "force-dynamic";

interface ListsClientProps {
  lists: RelatedUser[];
}

const ListsClient: FC<ListsClientProps> = ({ lists }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
      // This is a side effect that runs after the first render and sets the isMounted state to true
      useEffect(() => {
        setIsMounted(true);
    }, []);
  
    // This is a conditional rendering that returns null if the component is not mounted yet
    if (!isMounted) {
        return null;
    }
  

  
  return (
    <div className="h-[80vh] flex-row">
      <h2 className="mb-2 ms-8 mt-2 flex text-2xl">Dine Lister</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <ScrollArea className="h-[380px] w-5/6 gap-4 rounded-md md:h-[600px] md:w-2/3">
          <div className="flex flex-col gap-1 p-4">
            {lists.map((list, idx) => (
              <div
                key={idx + "_outer"}
                className="shadow-3xl mb-4 transform 
                            bg-white transition-all duration-300 
                            hover:translate-y-1 hover:cursor-pointer md:hover:bg-gray-300"
                onClick={() => {
                  console.log("list type", list.listType);
                  if(list.listType === ListStatus.SHOPPING.valueOf()){
                    return router.push(`/liste?listId=${list.listId}&action=${ListAction.Buy}`)
                  } 
                  else if(list.listType === ListStatus.STOCKING.valueOf()) {
                    return router.push(`/liste?listId=${list.listId}&action=${ListAction.View}`)
                  }
                  else {
                    return router.push(`/${URLS.HOME}`)
                  }
                }
              }
              >
                <div
                  className="mx-2 flex 
                            justify-between text-center text-sm text-black"
                >
                  <div className="">{list.name}</div>
                  {/* <div className=" ">1/1</div> */}
                  <div className=" ">...</div>
                </div>
                <div className="mx-2 flex items-center space-x-[-20px]">
                  {list.avatars?.map(async (props, idx) => {
                    return <GetAvatar key={`${idx}_${props.clerkId}`} clerkId={props.clerkId}
                      imageUrl={props.imageUrl} initials={props.initials}  />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className=" flex flex-wrap justify-center gap-4">
        <GoToButton text="Tilføj ny liste" url={`${URLS.LISTS}?action=create`} />
      </div>
    </div>
  );
};
export default ListsClient;
