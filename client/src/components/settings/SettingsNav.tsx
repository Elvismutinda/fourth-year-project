"use client";

import { cn } from "@/lib/utils";
import { MainNavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SettingsNavProps = {
  items: MainNavItem[];
};

const SettingsNav = ({ items }: SettingsNavProps) => {
  const path = usePathname();

  if (!items?.length) return null;

  return (
    <div className="inline-flex h-9 items-center rounded-lg bg-secondary/80 p-1 text-secondary-foreground no-srollbar w-full justify-start overflow-auto md:w-fit outline-none">
      {items.map((item, index) => (
        <Link key={index} href={item.disabled ? "#" : item.href}>
          <span
            className={cn(
              "mx-0.5 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-accent",
              path === item.href ? "bg-[#1A1928]" : "hover:bg-[#1A1928]/50",
              item.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span>{item.title}</span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SettingsNav;
