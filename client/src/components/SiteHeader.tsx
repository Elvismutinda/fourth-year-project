import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "./ui/button";

interface SiteHeaderProps {
  icon?: LucideIcon | IconType;
  heading: string;
  children?: React.ReactNode;
}

const SiteHeader = ({ icon: Icon, heading, children }: SiteHeaderProps) => {
  return (
    <div className="flex items-center justify-between py-3 pl-8 text-slate-500">
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="p-0.5 rounded-md border bg-slate-50">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <h1 className="font-semibold tracking-tighter text-xl">{heading}</h1>
      </div>
      {children}
    </div>
  );
};

export default SiteHeader;
