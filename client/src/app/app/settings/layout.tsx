import React from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "../../../../auth";
import { ChevronLeft } from "lucide-react";
import SettingsNav from "@/components/settings/SettingsNav";
import { settingsConfig } from "@/config/settings";
import { UserDetails } from "@/components/settings/UserDetails";
import { redirect } from "next/navigation";
import { User } from "next-auth";

const SettingsLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  const user = session?.user as
    | (User & {
        role: "USER" | "PREMIUM";
        paystackSubscriptionEnd: string | null;
      })
    | undefined;

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col px-4 pb-24 pt-6 md:px-6 lg:px-8 bg-[#1A1928]">
      <div className="flex justify-between items-center pb-8">
        <Link
          href="/app/chat/new"
          className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 flex items-center hover:bg-transparent/30"
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
          <Button
            variant="transparent"
            type="submit"
            className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 flex items-center hover:bg-transparent/30"
          >
            Sign Out
          </Button>
        </Form>
      </div>

      <div className="flex flex-grow flex-col gap-4 md:flex-row">
        <UserDetails user={user} />

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
