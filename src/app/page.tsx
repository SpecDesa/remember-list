import { SignedIn, SignedOut } from "@clerk/nextjs";
import Lists from "./_components/_lists/lists-server";
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
          <div className="h-full w-full text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <Lists />
        </SignedIn>
      </main>
    );
}
