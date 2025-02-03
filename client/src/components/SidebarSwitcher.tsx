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

interface SidebarSwitcherProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

const SidebarSwitcher = ({
  icon: Icon,
  label,
  isActive,
}: SidebarSwitcherProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-1 cursor-pointer group">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="transparent"
              size="icon"
              className={cn(
                "size-9 p-2 rounded-md group-hover:bg-accent/20",
                isActive ? "bg-accent/20" : "opacity-70"
              )}
            >
              <Icon className="size-5 text-[#fff] group-hover:opacity-100 transition-all" />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="end">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SidebarSwitcher;
