"use client";

import dynamic from "next/dynamic";
const PaystackButton = dynamic(
  () =>
    import("@/components/payment/PaystackClientButton").then(
      (mod) => mod.PaystackButton
    ),
  {
    ssr: false,
  }
);
import { useTransition } from "react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

import { upgradeToPremium } from "../../app/app/settings/actions";
import { subscriptionDetails } from "@/config/subscription";
import { Icons } from "@/components/Icons";
import { toast } from "sonner";
import { MessageInfo } from "../settings/MessageInfo";
import { ManageSubscription } from "./ManageSubscription";

export default function PaystackPayment({
  user,
}: {
  user: User & {
    email: string;
    role: "USER" | "PREMIUM";
    paystackSubscriptionEnd: string | null;
  };
}) {
  const isPremium = user?.role === "PREMIUM";

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    toast.error("Paystack public key is not set!");
    return null;
  }

  const paystackConfig = {
    email: user.email,
    amount: 50000,
    publicKey,
    currency: "KES",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: user.name,
        },
        // {
        //   display_name: "Phone",
        //   variable_name: "phone",
        //   value: phone,
        // },
      ],
    },
    onSuccess: () => {
      startTransition(() => {
        upgradeToPremium(user.email).then(async (data) => {
          if (data?.error) {
            toast.error(data?.error);
          } else {
            toast.success(data?.success);

            await update();
          }
        });
      });
    },
    onClose: () => {
      toast.error("Payment cancelled!");
    },
    onError: () => {
      toast.error("Payment failed. Try again later!");
    },
  };

  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {isPremium ? (
            <h2 className="text-center text-2xl font-bold md:text-left">
              Pro Plan Benefits
            </h2>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold md:text-left">
                Upgrade to Pro
              </h2>
              <div className="mt-2 flex flex-col items-center justify-center text-right md:mt-0 md:flex-row md:items-center md:justify-center md:text-right">
                <div className="text-xl font-bold md:text-3xl">
                  Ksh. 500
                  <span className="text-lg text-muted/80">/month</span>
                </div>
              </div>
            </>
          )}
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
                  <h3 className="font-bold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted/80">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {isPremium ? (
            <ManageSubscription user={user} />
          ) : (
            <PaystackButton
              {...paystackConfig}
              text="Upgrade Now"
              disabled={isPending}
              className="bg-[#61bd73] text-[#130c49] hover:bg-[#61bd73]/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 py-2 w-full md:w-64"
            />
          )}
        </div>
      </div>

      <MessageInfo user={user} className="md:hidden" />
    </div>
  );
}
