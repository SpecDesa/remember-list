import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { CSPostHogProvider } from "./_analytics/provider";

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
      <CSPostHogProvider>
        <html lang="en">
          <body className={`${GeistSans.variable} dark flex flex-col gap-4`}>
            <TopNav />
            {children}
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
