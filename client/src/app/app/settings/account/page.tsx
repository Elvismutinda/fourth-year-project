"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import ProfileUpdateForm from "@/components/auth/ProfileUpdateForm";
import PasswordUpdateForm from "@/components/auth/PasswordUpdateForm";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount } from "../actions";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const AccountPage = () => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const toastId = toast.loading("Deleting user account...");

    startTransition(() => {
      deleteAccount().then((data) => {
        if (data?.error) {
          toast.error(data?.error, { id: toastId });
        } else {
          toast.success(data?.success, { id: toastId });

          signOut({ callbackUrl: "/login" });
        }
      });
    });
  };

  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Update Account Information</h2>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            <ProfileUpdateForm />
          </div>

          {/* <div className="hidden md:block w-px bg-accent h-3/4 self-center"></div> */}
          <Separator
            orientation="vertical"
            className="hidden md:block w-px bg-accent h-3/4 self-center"
          />

          <div className="flex-1">
            <PasswordUpdateForm />
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-card p-4 md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Message Usage</span>
        </div>
      </div>

      <div className="!mt-24">
        <div className="-m-4 w-fit space-y-2 rounded-lg border border-muted-foreground/10 p-4 hover:bg-transparent/50">
          <h2 className="text-2xl font-bold">Danger Zone</h2>
          <div className="space-y-6">
            <p className="text-sm text-muted/80">
              Permanently delete your account and all associated data.
            </p>
            <div className="flex flex-row gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-destructive-foreground shadow-sm h-9 px-4 py-2 border border-red-800/50 bg-red-800/50 hover:bg-red-800">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1A1928] border border-muted/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This will permanently delete your account and all
                      associated data. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent text-inherit hover:bg-transparent/30 hover:text-white-100 border-none">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isPending}
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-red-800 text-delete-foreground shadow-sm hover:bg-red-800/90 h-9 px-4 py-2"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
