"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function SidebarUserNav({
  user,
}: {
  user: User & { role: "USER" | "PREMIUM" };
}) {
  const isPremium = user.role === "PREMIUM";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#939395] hover:bg-[#939395]/90 relative z-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <span className="font-bold text-xl">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col justify-center text-sm ml-[70px] w-56 bg-[#2A2939] border border-gray-700 shadow-lg p-2 rounded-xl text-[#fff]">
        <div className="flex gap-2 p-2 mt-1 rounded-md">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#939395] border-[#205DC2]">
            <span className="font-bold text-xl">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-slate-300 text-xs">
              {isPremium ? "Premium" : "Free"}
            </div>
          </div>
        </div>

        <Separator className="my-2 bg-gray-600" />

        <div>
          <Link
            href="/app/settings/account"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
          >
            <Settings className="size-4" /> Settings
          </Link>

          <Separator className="my-2 bg-gray-600" />
          <div
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="size-4" /> Sign out
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
