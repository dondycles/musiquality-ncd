import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/query-provider";
import { UserDataProvider } from "@/components/user-data-provider";

const cormorant = localFont({
  src: [
    {
      path: "./fonts/CormorantUnicase-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/CormorantUnicase-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cormorant",
});
const poppins = localFont({
  src: [
    {
      path: "./fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "MusiQuality",
  description: "Quality music sheets for sale!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${cormorant.variable} ${poppins.variable} font-poppins antialiased flex flex-col min-h-screen`}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <QueryProvider>
              <UserDataProvider>
                <Nav />
                {children}
                <Footer />
                <Toaster />
              </UserDataProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
