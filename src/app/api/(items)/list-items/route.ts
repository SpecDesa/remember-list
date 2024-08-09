
import { createItem, deleteItem } from "~/server/db/queries";
import { getPusherInstance } from "~/server/pusher/pusherServer";

const pusherServer = getPusherInstance();


export async function POST(req: Request) {  
  // const auth = useAuth();
  // const userInfo = useUser();


  const itemObj = await req.json() as unknown as {name: string, listId: number, quantity?: number}
    const itemCreated = await createItem({itemName: itemObj.name, listId: itemObj.listId, quantity: itemObj?.quantity})
    if(!itemCreated) return Response.json({msg: "Item not created."}, {status: 400});

    
    const CreatedItemObj = {data: {itemCreated, type: "added-item", itemName: itemObj.name}}

    
    if(CreatedItemObj.data.itemCreated){
      await pusherServer.trigger(
        'private-chat-lists',
        "evt::list-update",
        CreatedItemObj.data
      )
      return Response.json({msg: "Created"})
    }
    return Response.json({msg: "Didn't create item  "}, {status: 500})
  }


  export async function DELETE(req: Request){

    const {listId, itemId} = await req.json() as {listId:number, itemId: number};

    if(!listId) return Response.json({msg: "listId wasn't found."}, {status: 400});
    if(!itemId) return Response.json({msg: "itemId wasn't found."}, {status: 400});


    const itemDeleted = await deleteItem(listId, itemId);

    //   const listsDeleted = await deleteList(Number(listId));

    // // const listsDeleted = [{hello: Number(listId)}]
    if(itemDeleted){
        return Response.json({msg: "Deleted list"})
    }
    else if (!itemDeleted){
        return Response.json({msg:"No list was deleted"}, {status: 204})

    }
    else {
        return Response.json({msg: "Something went wrong"}, {status: 500})
    }
}