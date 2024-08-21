'use server'
import { auth, clerkClient } from "@clerk/nextjs/server";

import { type NextRequest, NextResponse } from "next/server";
import { deleteList, deleteUserFromList, getDBUserId, getListFromId, getUsersOfList } from "~/server/db/queries";


export async function GET(req: NextRequest){
    
    const user = auth();
    
    if (!user.userId) {
        return NextResponse.json({msg: "Unauthorized"}, {status: 401})
    }

    const listId = req.nextUrl.searchParams.get('listId');
    console.log("Hit it", listId)
    if(!listId){
        return NextResponse.json({msg: "Missing listId"}, {status: 400})
    }

    const listIdNumber: number = Number(listId);

    if(!listIdNumber){
        return NextResponse.json({msg: "listId not a number"}, {status: 400})
    }

    const usersOfDBList = await getUsersOfList({listId: listIdNumber});

    if(!usersOfDBList || usersOfDBList.length === 0 ){
        return NextResponse.json({msg: "Could not find any users on that list with that id"}, {status: 404})
    }

    return NextResponse.json(usersOfDBList);

}


export async function DELETE(req: NextRequest){
    const {listId, userId} = await req.json() as {listId:number, userId: number};
    console.log(listId, userId, '..asdsadasd');
    if(!listId) return NextResponse.json({msg: "listId wasn't found."}, {status: 400});


    const deletedResult = await deleteUserFromList({listId, userId})

    console.log('delete ->', deletedResult);

    if(!deletedResult || deletedResult.length <= 0){
        if(!listId) return NextResponse.json({msg: "No user was removed."}, {status: 200});
    }

    return NextResponse.json({msg: `user was removed: ${deletedResult?.map(user => `${user.id}, `)}`});
} 

