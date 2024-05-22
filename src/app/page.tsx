import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic"

// const mockUrls = [
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
//   "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
// ];


async function Tasks () {
  const items = await db.query.items.findMany({
    orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
  });
    // const mockImages = mockUrls.map((url, index) => ({
  //   id: index + 1,
  //   url,
  // }));


  return (
    <div className="flex flex-wrap gap-4">
    {items.map((item) => (<div className="w-48" key={`${item.id}`}>{item.name}</div>))
    }
      {/* {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map(
        (image, index) => (
          <div key={image.url + "_" + index} className="w-48">
            <Image width={200} height={200} src={image.url} alt="image" />
          </div>
        ),
      )} */}
    </div>
  )
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="w-full h-full text-2xl text-center">
          Please sign in above
        </div>
        </SignedOut>
      <SignedIn>
         <Tasks />
      </SignedIn>

    </main>
  );
}
