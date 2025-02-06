"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";

import { signOut } from "next-auth/react";
import { SidebarNavItem } from "@/types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "./Icons";

type SettingSidebarProps = {
  items: SidebarNavItem[];
};

export function SettingSidebar({ items, className }: SettingSidebarProps & { className?: string }) {
  const path = usePathname();

  if (!items.length) {
    return null;
  }

  return (
    <Sidebar className={cn("group-data-[side=left]:border-r-0", className)}>
      <SidebarHeader>
        <SidebarMenu>
          <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
            Settings
          </span>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            item.href &&
            Icon && (
              <Link key={index} href={item.disabled ? "/" : item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          );
        })}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
