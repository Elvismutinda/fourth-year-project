"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

      <NextThemesProvider attribute={"class"} defaultTheme={"light"}>
          {children}
      </NextThemesProvider>

  );
}
