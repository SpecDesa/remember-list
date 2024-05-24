

import { NextResponse } from "next/server";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";

// A faulty API route to test Sentry's error monitoring
export function POST(request: Request) {
    const requestHeaders = headers();
    const authValue = requestHeaders.get("AuthorizationClerk")
    console.log("TEST", authValue)
    console.log("Header;", request.headers)

    console.log(request.body)
    return NextResponse.json({ ok: "Ok", body: request.body })
}
