import Image from "next/image";
import React from "react";
import SidebarSwitcher from "./SidebarSwitcher";
import { Brain, Home, PencilLine, Scale } from "lucide-react";
import { usePathname } from "next/navigation";

const AppSidebar = () => {
  const pathname = usePathname();
  
  return (
    <aside className="w-[70px] h-full bg-[#130c49] flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]">
      <div>
        <Image
          src="/assets/images/logosaas.png"
          alt="logo"
          width={40}
          height={40}
        />
        <SidebarSwitcher
          icon={Home}
          label="Home"
          isActive={pathname.includes("/app")}
        />
        <SidebarSwitcher icon={Brain} label="RAG" />
        <SidebarSwitcher icon={Scale} label="Case Laws" />
        <SidebarSwitcher icon={PencilLine} label="Draft" />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        {/* <UserButton /> */}
      </div>
    </aside>
  );
};

export default AppSidebar;
