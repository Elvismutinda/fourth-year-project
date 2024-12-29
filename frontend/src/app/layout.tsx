import { Mulish } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@nextui-org/react";
import React from "react";
import { siteConfig } from "@/config/site";
import AppLayoutWrapper from "./layoutWrapper";
import { Metadata } from "next";

const mulishFont = Mulish({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={cn(mulishFont.className, "dark:bg-black antialiased")}>
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}
