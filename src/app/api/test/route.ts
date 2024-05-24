

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { signUpUser } from "~/server/db/queries";
import { env } from "~/env";

import type { ClerkUser } from "~/types/clerk/clerk-user";
export const dynamic = "force-dynamic";

// A faulty API route to test Sentry's error monitoring
export async function POST(request: Request) {
    const requestHeaders = headers();
    const authValue = requestHeaders.get("AuthorizationClerk")
    console.log("Gotten value", authValue);
    console.log("Backend Valu", process.env.CLERK_WEBHOOK_AUTH_KEY)
    
    if( env.CLERK_WEBHOOK_AUTH_KEY !== authValue){
        return NextResponse.json({message: "Either route not found or auth invalid"}, {status: 404})
    }

    console.log("Signing up user")

    await signUpUser(request.body as unknown as ClerkUser)
    
    return NextResponse.json({ ok: "Ok", body: request.body })
}
