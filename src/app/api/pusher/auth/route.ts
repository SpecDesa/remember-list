
import { getPusherInstance } from "~/server/pusher/pusherServer";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("authenticating pusher perms...")
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // logic to check user permissions
    if(!socketId || !channelName){
        console.error("123123", socketId, channelName);
        return
    }
  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse));
}