import { User } from "next-auth";
import Image from "next/image";

export function UserDetails({ user }: { user: User }) {
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
        <p className="break-all text-muted-foreground">{user.email}</p>
        <span className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-secondary text-primary-foreground">
          {/* {user.subscription} */}
          Free Plan
        </span>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-black">
            Message Usage
          </span>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-black">Standard</h3>
              <span className="text-sm text-muted-foreground">0/20</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              20 messages remaining
            </p>
          </div>
        </div>
      </div>

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
