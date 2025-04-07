import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import AppLayoutWrapper from "./layoutWrapper";
import { Toaster } from "sonner";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const mulishFont = Mulish({
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(mulishFont.className, "antialiased")}>
        <AppLayoutWrapper>
          <div className="mx-auto min-h-screen justify-center items-center">
            {children}
          </div>
          <Toaster richColors theme="dark" />
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
