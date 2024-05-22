import Link from "next/link";
import Image from 'next/image'
export default function HomePage() {
  
 const mockUrls = [
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
  "https://utfs.io/f/fc293c6e-7ba9-4281-a1f7-99965314538c-v2jhnj.png",
] 


 const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
 }))
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {
        [...mockImages, ...mockImages, ...mockImages, ...mockImages].map((image) => (
          <div key={image.url} className="w-48">
            <Image 
              width={200}
              height={200} 
              src={image.url} alt="image" />
            </div>
        ))
        }
      </div>
    </main>
  );
}
