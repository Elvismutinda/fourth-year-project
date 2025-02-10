"use client";

import Link from "next/link";
import React from "react";
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
