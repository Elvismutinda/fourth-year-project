import React from "react";
import { Button } from "@/components/ui/button";
import { subscriptionDetails } from "@/config/subscription";
import { Icons } from "@/components/Icons";

const SubscriptionPage = () => {
  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-center text-2xl font-bold md:text-left">
            Upgrade to Pro
          </h2>
          <div className="mt-2 flex flex-col items-center justify-center text-right md:mt-0 md:flex-row md:items-center md:justify-center md:text-right">
            <div className="text-xl font-bold md:text-3xl">
              Ksh. 500
              <span className="text-lg text-muted-foreground">/month</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {subscriptionDetails.map((item, index) => {
            const IconComp = Icons[item.icon as keyof typeof Icons];
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  {IconComp && (
                    <IconComp className="mr-2 w-5 h-5 text-[#a3004c]" />
                  )}
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <Button
            variant="main"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground shadow h-9 px-4 py-2 w-full md:w-64"
          >
            Upgrade Now
          </Button>
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-4 md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Message Usage</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
