

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// A faulty API route to test Sentry's error monitoring
export function POST(request: Request) {
    console.log("TEST")

    console.log(request.body)
    return NextResponse.json({ ok: "Ok", body: request.body })
}