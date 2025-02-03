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
    <aside className="w-[70px] h-full bg-[#1A1928] flex flex-col items-center py-4 gap-y-2">
      <div className="mb-4">
        <Image
          src="/assets/images/logosaas.png"
          alt="logo"
          width={40}
          height={40}
        />
      </div>

      <nav className="flex flex-col gap-y-2">
        <SidebarSwitcher
          icon={Home}
          label="Home"
          isActive={pathname.includes("/app")}
        />
        <SidebarSwitcher icon={Brain} label="RAG" />
        <SidebarSwitcher icon={Scale} label="Case Laws" />
        <SidebarSwitcher icon={PencilLine} label="Draft" />
      </nav>

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <SidebarUserNav user={user} />
      </div>
    </aside>
  );
};

export default AppSidebar;
