import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";

export const dynamic = "force-dynamic"

const mockUrls = [
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
];
export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  console.log("posts", posts)

  const mockImages = mockUrls.map((url, index) => ({
    id: index + 1,
    url,
  }));
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map(
          (image, index) => (
            <div key={image.url + "_" + index} className="w-48">
              <Image width={200} height={200} src={image.url} alt="image" />
            </div>
          ),
        )}
      </div>
    </main>
  );
}
