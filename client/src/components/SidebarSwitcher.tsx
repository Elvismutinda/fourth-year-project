import React from "react";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";

interface SidebarSwitcherProps {
  icon: LucideIcon | IconType;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarSwitcher = ({
  icon: Icon,
  label,
  href,
  isActive,
}: SidebarSwitcherProps) => {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center gap-y-1 cursor-pointer group">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="transparent"
                size="icon"
                className={cn(
                  "rounded-sm group-hover:bg-accent/20 transition-all",
                  isActive ? "bg-accent/20" : "group-hover:bg-[#1A1928]"
                )}
              >
                <Icon
                  className={cn(
                    "group-hover:opacity-100 transition-all group-hover:text-accent",
                    isActive ? "text-accent" : "text-accent/40"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Link>
  );
};

export default SidebarSwitcher;
