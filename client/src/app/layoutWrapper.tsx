"use client";

import React from "react";
import StoreProvider from "@/state/redux";

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
