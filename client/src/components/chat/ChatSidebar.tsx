"use client";

import { User } from "next-auth";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
//   useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { SidebarHistory } from "./SidebarHistory";

export function ChatSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link href="/app" className="flex flex-row gap-3 items-center">
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Intelaw
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    router.push("/app/");
                    router.refresh();
                  }}
                >
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
    </Sidebar>
  );
}
