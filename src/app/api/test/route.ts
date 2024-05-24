

import { NextResponse } from "next/server";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";

// A faulty API route to test Sentry's error monitoring
export function POST(request: Request) {
    const requestHeaders = headers();
    const authValue = requestHeaders.get("AuthorizationClerk")
    console.log("Gotten value", authValue);
    console.log("Backend Valu", process.env.CLERK_WEBHOOK_AUTH_KEY)
    
    if(process.env.CLERK_WEBHOOK_AUTH_KEY !== authValue){
        return NextResponse.json({message: "Either route not found or auth invalid"}, {status: 404})
    }


    
    return NextResponse.json({ ok: "Ok", body: request.body })
}
