import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { getTasks } from "~/server/db/queries";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from "~/components/ui/button";
import Lists from "./_components/lists";

export const dynamic = "force-dynamic"

// const mockUrls = [
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
// ];


export default async function HomePage() {
    return (
            <main className="">
            <SignedOut>
            <div className="w-full h-full text-2xl text-center">
            Please sign in above
            </div>
            </SignedOut>
            <SignedIn>
            <Lists />
            </SignedIn>

            </main>
           );
}
