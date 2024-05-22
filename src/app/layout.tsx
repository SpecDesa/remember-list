import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { TopNav } from "./_components/topnav";


export const metadata = {
  title: "Huskelisten",
  description: "Huskelisten til dine indkøb.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" >
      <body className={`${GeistSans.variable} flex flex-col gap-4 dark`}>
        <TopNav/>
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
