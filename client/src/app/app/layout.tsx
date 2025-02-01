import AppSidebar from "@/components/AppSidebar";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      {children}
    </div>
  );
}
