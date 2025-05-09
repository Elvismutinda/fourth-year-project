import { cookies } from "next/headers";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { auth } from "../../../../auth";
import Script from "next/script";
import { AppHeader } from "@/components/AppHeader";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <div className="relative flex h-screen bg-[#1A1928]">
          <ChatSidebar user={session?.user} className="ml-[4.25rem] z-10" />
        </div>

        <SidebarInset className="bg-[#1A1928]">
          <div className="border-b border-[#2D2C3A]">
            <AppHeader />
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
