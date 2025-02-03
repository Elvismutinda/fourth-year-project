import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { auth } from "../../../../auth";
import Script from "next/script";
import { SettingSidebar } from "../../../components/SettingSidebar";
import { settingConfig } from "@/config/setting";
import { SidebarToggle } from "@/components/SidebarToggle";

export const experimental_ppr = true;

export default async function SettingLayout({
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
        <SettingSidebar items={settingConfig.sidebarNav} />
        <SidebarInset>
          <SidebarToggle />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
