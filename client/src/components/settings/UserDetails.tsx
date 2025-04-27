import { User } from "next-auth";
import Image from "next/image";
import { MessageInfo } from "./MessageInfo";
import { cn } from "@/lib/utils";

export function UserDetails({
  user,
}: {
  user: User & {
    role: "USER" | "PREMIUM";
    paystackSubscriptionEnd: string | null;
  };
}) {
  const isPremium = user.role === "PREMIUM";

  return (
    <div className="hidden space-y-8 md:block md:w-1/4">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center w-40 h-40 rounded-full bg-[#939395]">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              className="w-40 h-40 rounded-full"
            />
          ) : (
            <span className="font-bold text-7xl">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="break-all text-muted/80">{user.email}</p>
        <span
          className={cn(
            "mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-primary-foreground",
            isPremium ? "bg-[#61bd73] text-[#130c49]" : "bg-secondary"
          )}
        >
          {isPremium ? "Pro Plan" : "Free Plan"}
        </span>
      </div>

      <MessageInfo user={user} />

      <div className="space-y-6 rounded-lg bg-card p-4 text-black">
        <span className="text-sm font-semibold">Keyboard Shortcuts</span>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">New Chat</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-secondary/50 px-2 py-1 text-sm">
                Ctrl
              </kbd>
              <kbd className="rounded bg-secondary/50 px-2 py-1 text-sm">
                Shift
              </kbd>
              <kbd className="rounded bg-secondary/50 px-2 py-1 text-sm">O</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Toggle Sidebar</span>
            <div className="flex gap-1">
              <kbd className="rounded bg-secondary/50 px-2 py-1 text-sm">
                Ctrl
              </kbd>
              <kbd className="rounded bg-secondary/50 px-2 py-1 text-sm">B</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
