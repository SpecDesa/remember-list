'use server'
import { auth, clerkClient } from "@clerk/nextjs/server";

import { type NextRequest, NextResponse } from "next/server";
import { deleteList, getDBUserId, getListFromId } from "~/server/db/queries";

export async function DELETE(req: NextRequest){
    const {listId} = await req.json() as {listId:number};
    if(!listId) return NextResponse.json({msg: "listId wasn't found."}, {status: 400})
    const listsDeleted = await deleteList(Number(listId));

    // const listsDeleted = [{hello: Number(listId)}]
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


export async function GET(req: NextRequest){
    const user = auth();
    
    if (!user.userId) {
        return NextResponse.json({msg: "Unauthorized"}, {status: 401})
    }

    const listId = req.nextUrl.searchParams.get('listId');

    if(!listId){
        return NextResponse.json({msg: "Missing listId"}, {status: 400})
    }

    const listIdNumber: number = Number(listId);

    if(!listIdNumber){
        return NextResponse.json({msg: "listId not a number"}, {status: 400})
    }

    const dbList =  await getListFromId({id: listIdNumber});

    if(!dbList || dbList.length === 0 ){
        return NextResponse.json({msg: "Could not find any list with that id"}, {status: 404})
    }

    return NextResponse.json(dbList[0]);

}

