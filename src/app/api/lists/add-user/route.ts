import { useAuth, useUser } from "@clerk/nextjs";

import { addUserToList, createList } from "~/server/db/queries";
import { type ListStatus } from "~/server/db/types";
import { getPusherInstance } from "~/server/pusher/pusherServer";

const pusherServer = getPusherInstance();


export async function POST(req: Request) {  
//   const auth = useAuth();
//   const userInfo = useUser();

  const listObj = await req.json() as unknown as {listId: number, email: string}
//   console.log('listobj', listObj)
  
    const createdObj = await addUserToList({listId: listObj.listId, emailOfUserToAdd: listObj.email})
    
    console.log(createdObj)
    
    if(createdObj){
    
    // Trigger user to be notified that new list is added?

    //   await pusherServer.trigger(
    //     'private-chat-lists',
    //     "evt::list-create",
    //     createdObj
    //   )


      return Response.json({msg: "Created"})
    }
    return Response.json({msg: "Didn't create list"}, {status: 500})
  }