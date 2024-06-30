import { useAuth, useUser } from "@clerk/nextjs";
import { createList } from "~/server/db/queries";
import { type ListStatus } from "~/server/db/types";
import { getPusherInstance } from "~/server/pusher/pusherServer";

const pusherServer = getPusherInstance();


export async function POST(req: Request) {  
  // const auth = useAuth();
  // const userInfo = useUser();

    const listObj = await req.json() as unknown as {name: string, type: ListStatus}
    const createdObj = await createList(listObj)
    if(createdObj){
      await pusherServer.trigger(
        'private-chat-lists',
        "evt::list-create",
        createdObj
      )
      return Response.json({msg: "Created"})
    }
    return Response.json({msg: "Didn't create list"}, {status: 500})
  }