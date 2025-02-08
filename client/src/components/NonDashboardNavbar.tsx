"use client";

import Link from "next/link";
import React from "react";
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const NonDashboardNavbar = () => {
  const user = useCurrentUser();

  return (
    <nav className="w-full flex justify-center bg-[#ededed]">
      <div className="flex justify-between items-center w-3/4 py-5">
        <div className="flex justify-between items-center gap-14">
          <Link
            href="/"
            className="font-bold text-lg sm:text-2xl text-[#2c3854]"
            scroll={false}
          >
            Intelaw
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative group">
              <Link
                href="/search"
                className="bg-[#2c3854] pl-10 sm:pl-14 pr-6 sm:pr-20 py-2.5 rounded-md text-[#fff] transition-all duration-300 text-sm "
                scroll={false}
              >
                <span className="hidden sm:inline">Search Cases</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen
                className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-[#fff] transition-all duration-300"
                size={18}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center ml-2">
          {user ? (
            <Link href="/app/chat/new">
              <Button variant="purple" size="lg">
                Proceed to Research Tool
              </Button>
            </Link>
          ) : (
            <div className="flex justify-between items-center gap-2 mx-auto">
            <Link href="/login">
              <Button variant="main" size="lg">
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button variant="purple" size="lg">
                Register
              </Button>
            </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;
