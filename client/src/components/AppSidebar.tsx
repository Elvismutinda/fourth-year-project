"use client";

import Image from "next/image";
import React from "react";
import SidebarSwitcher from "./SidebarSwitcher";
import { Brain, Home, PencilLine, Scale } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarUserNav } from "./SidebarUserNav";
import { User } from "next-auth";

const AppSidebar = ({ user }: { user: User }) => {
  const pathname = usePathname();

  return (
    <aside className="w-[4.25rem] h-full bg-[#14141F] flex flex-col items-center py-4 gap-y-2 border-r border-[#2D2C3A] overflow-y-auto">
      <div className="mb-4 bg-white-100 rounded-md p-1 flex items-center justify-center">
        <Image
          src="/assets/icons/intelaw-logo.png"
          alt="logo"
          width={40}
          height={40}
        />
      </div>

      <nav className="flex flex-col gap-y-2">
        {/* <SidebarSwitcher
          icon={Home}
          label="Home"
          href="/app/chat/new"
          isActive={pathname.includes("/app/chat/new")}
        /> */}
        <SidebarSwitcher
          icon={Brain}
          label="Chat"
          href="/app/chat/new"
          isActive={pathname.includes("/app/chat")}
        />
        <SidebarSwitcher
          icon={Scale}
          label="Case Laws"
          href="/app/caselaws"
          isActive={pathname.includes("/app/caselaws")}
        />
        <SidebarSwitcher
          icon={PencilLine}
          label="Draft"
          href="/app/draft"
          isActive={pathname.includes("/app/draft")}
        />
      </nav>

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <SidebarUserNav user={user} />
      </div>
    </aside>
  );
};

export default AppSidebar;
