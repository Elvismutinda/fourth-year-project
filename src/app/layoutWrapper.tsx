"use client";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute={"class"} defaultTheme={"light"}>
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}
