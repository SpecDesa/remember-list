import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import { CSPostHogProvider } from "./_analytics/provider";
import Breadcrumbs from "./_components/breadcrumbs";


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
            {/* <div className="flex justify-end mx-2 md:invisible">Burger menu</div> */}
            {/* <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
          <Breadcrumbs>
          </Breadcrumbs>
            {children}
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
