'use client';
import { ScrollArea } from "~/components/ui/scroll-area";
import { type RelatedUser} from "~/server/db/queries";
import GetAvatar from "../get-avatar";
import { URLS } from "../../_urls/urls";
import GoToButton from "../go-to-button";
import {  useEffect, useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { ListStatus } from "~/server/db/types";
import { ListAction } from "../../(lister)/lister/page";
import Swipeable from "../swipeable";
import DeleteListButton from "./delete-list-button";
import { Button } from "~/components/ui/button";
export const dynamic = "force-dynamic";

interface ListsClientProps {
  lists: RelatedUser[];
}


  

const ListsClient: FC<ListsClientProps> = ({ lists}) => {
  const [isMounted, setIsMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const [posts, setPosts] = useState<any>([])

  const router = useRouter();
      // This is a side effect that runs after the first render and sets the isMounted state to true
      useEffect(() => {
        setIsMounted(true);
    }, []);


    const connectToStream = () => {
      // Connect to /api/stream as the SSE API source
      const eventSource = new EventSource('/api/stream')

      eventSource.addEventListener('message', (event) => {
        // Parse the data received from the stream into JSON
        // Add it the list of messages seen on the page
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        const tmp = JSON.parse(event.data)
        // Maintain a list of notifications
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
        setPosts((prevPosts: any) => [...prevPosts, tmp])
        // Create a toast with the latest notification
        console.log(`${tmp.country}: ${tmp.message}`)
      })
      // In case of any error, close the event source
      // So that it attempts to connect again
      eventSource.addEventListener('error', () => {
        console.log("Closing in lists-clietn r53")
        eventSource.close()
        setTimeout(connectToStream, 1)
      })
      // As soon as SSE API source is closed, attempt to reconnect
      // eventSource.onclose = () => {
      //   setTimeout(connectToStream, 1)
      // }
      return eventSource
    }
    useEffect(() => {
      // Initiate the first call to connect to SSE API
      const eventSource = connectToStream()
      // As the component unmounts, close listener to SSE API
      return () => {
        console.log("Closing in lists-clietn r68")
        eventSource.close()
      }
    }, [])

    

    useEffect(() => {
 
      // Initiate the first call to connect to SSE API
      const eventSource = new EventSource('/api/stream')
   
      eventSource.addEventListener('posts', (event) => {
        // Parse the data received from the stream into JSON
        // Add it the list of messages seen on the page
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        const tmp = JSON.parse(event.data)
        // Do something with the obtained message
        console.log('something happened here!', tmp)
      })
   
      // As the component unmounts, close listener to SSE API
      return () => {
        console.log("Closing in lists-clietn r91")
        eventSource.close()
      }
   
    }, [])
  
  
    // This is a conditional rendering that returns null if the component is not mounted yet
    if (!isMounted) {
        return null;
    }

  
  return (
    <div className="h-[80vh] flex-row">
      <Button variant={"default"} onClick={(e) => {e.preventDefault(); void fetch('/api/stream', {
      method: 'POST'
      }
      )}}>Click</Button>
      <h2 className="mb-2 ms-8 mt-2 flex text-2xl">Dine Lister</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <ScrollArea className="h-[380px] w-5/6 gap-4 rounded-md md:h-[600px] md:w-2/3">
          <div className="flex flex-col gap-1 p-4">
            {lists.map((list, idx) => (
              <div key={idx + "_outer"} className="flex flex-row">
                
              <Swipeable key={idx + "_outer"} 
                deleteButton={
                <DeleteListButton listId={list.listId} /> 
              }
              >
              <div
                className="shadow-3xl  transform 
                            bg-white transition-all duration-300 
                            hover:translate-y-1 hover:cursor-pointer md:hover:bg-gray-300"
                onClick={() => {
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
              </Swipeable>
              {/* {deleteElements[idx]} */}
              </div>
            )
            )
            }
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
