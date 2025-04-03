import React from "react";
import Link from "next/link";
import Form from "next/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth, signOut } from "../../../../auth";
import { ChevronLeft } from "lucide-react";
import SettingsNav from "@/components/settings/SettingsNav";
import { settingsConfig } from "@/config/settings";
import { UserDetails } from "@/components/settings/UserDetails";

const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] w-full flex-col px-4 pb-24 pt-6 md:px-6 lg:px-8">
      <div className="flex justify-between items-center pb-8">
        <Link
          href="/app/chat/new"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Link>
        <Form
          action={async () => {
            "use server";

            await signOut({
              redirectTo: "/login",
            });
          }}
        >
          <Button variant="ghost" type="submit">
            Sign Out
          </Button>
        </Form>
      </div>

      <div className="flex flex-grow flex-col gap-4 md:flex-row">
        <UserDetails user={session?.user ?? {}} />

        <div className="md:w-3/4 md:pl-12">
          <div className="space-y-6">
            <SettingsNav items={settingsConfig.mainNav} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
