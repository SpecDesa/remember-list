'use client'
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
// import { UploadButton } from "~/utils/uploadthing";
import { URLS } from "../_urls/urls";


export function TopNav() {
  const router = useRouter();

  const DotIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      </svg>
    )
  }

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
            {/* <UserButton /> */}
            <UserButton>
              {/* Some day may be needed when implementing emails */}
              {/* <UserButton.MenuItems>
                <UserButton.Action
                label="Få email notifikationer"
                labelIcon={<DotIcon />}
                onClick={() => alert('Email subscribed/unsubscribed')}
                />
                </UserButton.MenuItems> */}
            </UserButton>

            </SignedIn>
        </div>
      </nav>
    )
  }