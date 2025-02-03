import * as React from "react";

import { cn } from "@/lib/utils";

interface SiteShellProps extends React.HTMLAttributes<HTMLDivElement> {}

const SiteShell = ({ children, className, ...props }: SiteShellProps) => {
  return (
    <div className={cn("border-b border-border flex w-full overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
};

export default SiteShell;
