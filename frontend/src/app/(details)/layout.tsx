import Link from "next/link";

import { MainNav } from "@/components/MainNav";
import SiteFooter from "@/components/SiteFooter";
import { buttonVariants } from "@/components/ui/Button";
import { detailsConfig } from "@/config/details";
import { cn } from "@/lib/utils";

export default function DetialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="container z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={detailsConfig.mainNav} />
          <nav>
            <Link
              href="https://digital-ob.000webhostapp.com/"
              target="_blank"
              className={cn(buttonVariants({ size: "sm" }), "px-4")}
            >
              Digital O.B v1
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
