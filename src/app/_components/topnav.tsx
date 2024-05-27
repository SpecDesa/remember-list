'use client'
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";
import { URLS } from "../_urls/urls";


export function TopNav() {
  const router = useRouter();


    return (
      <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
        <div onClick={() => router.push(URLS.HOME)}>Huskelisten</div>
        <div className="flex flex-row ">
          <SignedOut><SignInButton /></SignedOut>
          <SignedIn>
            {/* <UploadButton endpoint="imageUploader"
              onClientUploadComplete={() => {
                router.refresh();
                }}/> */}
            <UserButton />
            </SignedIn>
        </div>
      </nav>
    )
  }