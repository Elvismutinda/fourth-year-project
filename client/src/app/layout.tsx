import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "./layoutWrapper";
// import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
      <html lang="en">
        <body className={`${dmSans.variable} antialiased`}>
          <AppLayoutWrapper>
            <Suspense fallback={null}>
              <div className="mx-auto w-full h-full justify-center items-center">{children}</div>
            </Suspense>
            <Toaster richColors closeButton />
          </AppLayoutWrapper>
        </body>
      </html>
    // </ClerkProvider>
  );
}
