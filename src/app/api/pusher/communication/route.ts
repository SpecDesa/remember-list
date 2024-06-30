import { NextResponse } from 'next/server'
import { getPusherInstance } from '~/server/pusher/pusherServer';

const pusherServer = getPusherInstance();

export async function POST(req: Request, res: Response) {
    try {
        const request = await req.json() as unknown;
        console.log("req", request)
        await pusherServer.trigger(
            'private-chat-lists',
            "evt::list-update",
            request
            // {
            //     message: "test",
            //     user: "ree",
            //     date: new Date(),
            // }
        )

        return NextResponse.json({ message: "Sockets tested" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to test sockets", error: error }, { status: 500 })
   
    }
    }
