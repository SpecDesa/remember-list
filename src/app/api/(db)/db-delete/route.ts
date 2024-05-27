

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { deleteUser } from "~/server/db/queries";
import { env } from "~/env";

import type { UserDeleted } from "~/types/clerk/clerk-user";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {

    const requestHeaders = headers();
    const authValue = requestHeaders.get("AuthorizationClerk")
    console.log("Gotten value", authValue);
    console.log("Backend Valu", process.env.CLERK_WEBHOOK_AUTH_KEY)
    
    if( env.CLERK_WEBHOOK_AUTH_KEY !== authValue){
        return NextResponse.json({message: "Either route not found or auth invalid"}, {status: 404})
    }
    const response = await request.json() as unknown as UserDeleted;
    await deleteUser(response)
    
    return NextResponse.json({ ok: "Ok", body: request.body })
}


