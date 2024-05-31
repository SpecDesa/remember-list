import { type NextRequest, NextResponse } from "next/server";
import { deleteList } from "~/server/db/queries";

export async function DELETE(req: NextRequest){
    // const {listId} = await req.json() as {listId:number};
    // if(!listId) return NextResponse.json({msg: "listId wasn't found."}, {status: 400})
    // const listsDeleted = await deleteList(Number(listId));

    const listsDeleted = [{hello: "test"}]
    if(listsDeleted && listsDeleted?.length > 0){
        return NextResponse.json({msg: "Deleted list"})
    }
    else if (listsDeleted && listsDeleted.length === 0 ){
        return NextResponse.json({msg:"No list was deleted"}, {status: 204})

    }
    else {
        return NextResponse.json({msg: "Something went wrong"}, {status: 500})
    }
}
