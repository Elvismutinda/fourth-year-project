import { Mulish } from "next/font/google";
import { cn } from "@nextui-org/react";
import "@/styles/globals.css";

import { siteConfig } from "@/config/site";
import AppLayoutWrapper from "./layoutWrapper";

const mulishFont = Mulish({ subsets: ["latin"] });

export const metadata = {
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
      <body className={cn(mulishFont.className, "dark:bg-black")}>
        <AppLayoutWrapper>{children}</AppLayoutWrapper>
      </body>
    </html>
  );
}
