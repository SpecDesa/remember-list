// Can be 'nodejs', but Vercel recommends using 'edge'
export const runtime = 'nodejs'

// Prevents this route's response from being cached
export const dynamic = 'force-dynamic'

// Use ioredis to subscribe
import Redis from 'ioredis'

import { Redis as RedisUpstash } from "@upstash/redis";


const redis = RedisUpstash.fromEnv();


// Define the key to listen and publish messages to
const setKey = 'posts'

// Create a redis subscriber
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const redisSubscriber = new Redis(process.env.UPSTASH_REDIS_URL ?? '');

export async function GET() {
  const encoder = new TextEncoder()
  // Create a stream
  const customReadable = new ReadableStream({
    start(controller) {
      // Subscribe to Redis updates for the key: "posts"
      // In case of any error, just log it
      console.log("On subscribe?")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      redisSubscriber.subscribe(setKey, (err) => {
        if (err) console.log('err subscribe', err)

            console.log("Subscribed", setKey)
      })
      // Listen for new posts from Redis
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      redisSubscriber.on('message', (channel, message) => {
        console.log(controller)
        // if(controller){

        //     // Send data with the response in the SSE format
        //     // Only send data when the channel message is reeived is same as the message is published to
            if (channel === setKey) controller.enqueue(encoder.encode(`data: ${message}\n\n`))
        //     }
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      redisSubscriber.on('end', () => {
        console.log("Closing in route")
        controller.close()
      })
    },
    
  })
  // Return the stream and try to keep the connection alive
  return new Response(customReadable, {
    // Set headers for Server-Sent Events (SSE) / stream from the server
    headers: {
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream; charset=utf-8',
    },
  })
}


export async function POST(req: Request) {  
    console.log("Here?");

    await redis.publish(
        'posts',
        JSON.stringify({
          country: 'dk',
          date: new Date().toString(),
          message: 'some random',
        }),
      );
   
    return Response.json({msg: "received"})
  }