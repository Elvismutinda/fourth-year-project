"use client";

import { useState, useTransition } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { User } from "next-auth";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { useSession } from "next-auth/react";
import { downgradeToFree } from "@/app/app/settings/actions";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

export function ManageSubscription({
  user,
}: {
  user: User & {
    email: string;
    role: "USER" | "PREMIUM";
    paystackSubscriptionEnd: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const subscriptionEnd = user.paystackSubscriptionEnd
    ? new Date(user.paystackSubscriptionEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const formattedDate = user.paystackSubscriptionEnd
    ? new Date(user.paystackSubscriptionEnd).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "N/A";

  function handleCancelSubscription() {
    startTransition(() => {
      downgradeToFree(user.email).then(async (data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);

          await update();
        }
        setShowConfirmCancel(false);
      });
    });
  }

  const now = new Date();
  const expiryDate = user.paystackSubscriptionEnd
    ? new Date(user.paystackSubscriptionEnd)
    : new Date();
  const daysLeft = differenceInDays(expiryDate, now);

  const ManageContent = (
    <AlertDialog open={showConfirmCancel} onOpenChange={setShowConfirmCancel}>
      <AlertDialogTrigger asChild>
        <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-destructive-foreground shadow-sm h-9 px-4 py-2 border border-red-800/50 bg-red-800 hover:bg-red-800/90">
          Cancel Subscription
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#1A1928] border border-muted/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to cancel your subscription? You will lose
            access to premium features and pay again for your next subscription.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-inherit hover:bg-transparent/30 hover:text-white-100 border-none">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-red-800 text-delete-foreground shadow-sm hover:bg-red-800/90 h-9 px-4 py-2"
            onClick={handleCancelSubscription}
            disabled={isPending}
          >
            Downgrade to Free
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#61bd73] text-[#130c49] hover:bg-[#61bd73]/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 py-2 w-full md:w-64">
            Manage Subscription
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#1A1928] border border-muted/20">
          <DialogHeader>
            <DialogTitle>Manage Your Subscription</DialogTitle>
            <DialogDescription className="text-gray-400">
              {user.role === "PREMIUM" ? (
                <span>
                  Your subscription is active until{" "}
                  <span className="font-semibold">{subscriptionEnd}</span>
                </span>
              ) : (
                <span>Your subscription has expired</span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="my-2">
            <p className="text-base">
              Next billing date: {formattedDate}{" "}
              {daysLeft >= 0 &&
                ` (${daysLeft} day${daysLeft > 1 ? "s" : ""} left)`}
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-transparent text-inherit hover:bg-transparent/30 hover:text-white-100 border-none">
                Close
              </Button>
            </DialogClose>
            {ManageContent}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-[#61bd73] text-[#130c49] hover:bg-[#61bd73]/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 py-2 w-full md:w-64">
          Manage Subscription
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#1A1928] border border-muted/20">
        <DrawerHeader className="text-left">
          <DrawerTitle>Manage Your Subscription</DrawerTitle>
          <DrawerDescription className="text-gray-400">
            {user.role === "PREMIUM" ? (
              <span>
                Your subscription is active until{" "}
                <span className="font-semibold">{subscriptionEnd}</span>
              </span>
            ) : (
              <span>Your subscription has expired</span>
            )}
          </DrawerDescription>
        </DrawerHeader>

        <div className="my-2 ml-4">
          <p className="text-base">
            Next billing date: {formattedDate}{" "}
            {daysLeft >= 0 &&
              ` (${daysLeft} day${daysLeft > 1 ? "s" : ""} left)`}
          </p>
        </div>

        <DrawerFooter>
          {ManageContent}
          <DrawerClose asChild>
            <Button className="bg-transparent text-inherit hover:bg-transparent/30 hover:text-white-100 border-none">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
