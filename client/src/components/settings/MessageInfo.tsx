"use client";

import { getUsageInfo } from "@/app/app/settings/actions";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";
import { useEffect, useState } from "react";

export function MessageInfo({
  user,
  className,
}: {
  user: User & { role: "USER" | "PREMIUM" };
  className?: string;
}) {
  const isPremium = user.role === "PREMIUM";

  const [remaining, setRemaining] = useState<number | null>(null);
  const [totalUsed, setTotalUsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      setIsLoading(true);
      const usage = await getUsageInfo();

      if (usage) {
        setRemaining(usage.remaining);
        setTotalUsed(usage.totalUsed);
      }

      setIsLoading(false);
    }

    if (user.role === "USER") {
      fetchUsage();
    } else {
      setIsLoading(false);
    }
  }, [user.role]);

  const totalLimit = 20;
  const usedPercent = (totalUsed / totalLimit) * 100;
  return (
    <div className={`space-y-6 rounded-lg bg-card p-4 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-black">Message Usage</span>
        {!isPremium && (
          <div className="text-xs text-muted-foreground">
            <p>Resets tomorrow at 3:00 AM</p>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          {isPremium ? (
            <h3 className="text-sm font-medium text-black">Standard</h3>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-black">Standard</h3>
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {totalUsed}/{totalLimit}
                  </span>
                )}
              </div>
            </>
          )}

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-400">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${usedPercent}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {user.role === "PREMIUM"
              ? "Unlimited messages"
              : isLoading
              ? "Loading..."
              : `${remaining} messages remaining`}
          </p>
        </div>
      </div>
    </div>
  );
}
