// import { useAuth, useUser } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { type NextRequest, NextResponse } from "next/server";
import { deleteList, getDBUserId } from "~/server/db/queries";

export async function GET(){
    const user = auth();
    
    if (!user.userId) {
        return NextResponse.json({msg: "Unauthorized"}, {status: 401})
    }


    const dbUserId = await getDBUserId(user.userId);

    if (!dbUserId?.id) {
        return NextResponse.json({msg: "no content"}, {status: 204})

      }
    return NextResponse.json(dbUserId)


}