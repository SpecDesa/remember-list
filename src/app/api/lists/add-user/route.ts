import { useAuth, useUser } from "@clerk/nextjs";

import { addUserToList, createList } from "~/server/db/queries";
import { type ListStatus } from "~/server/db/types";
import { getPusherInstance } from "~/server/pusher/pusherServer";

const pusherServer = getPusherInstance();


export async function POST(req: Request) {  
    const listObj = await req.json() as unknown as {listId: number, email: string}
    const addedUserObj = await addUserToList({listId: listObj.listId, emailOfUserToAdd: listObj.email})
        
    if(addedUserObj){
    // Trigger user to be notified that new list is added?
      await pusherServer.trigger(
        'private-chat-lists',
        "evt::list-add-user",
        addedUserObj[0]
      )

      return Response.json({msg: "Created"})
    }
    return Response.json({msg: "Didn't create list"}, {status: 500})
  }