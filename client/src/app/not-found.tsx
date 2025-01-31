"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { HiArrowRight, HiDocumentSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function AppLoader() {
  const router = useRouter();

  return (
    <main className="flex gap-4 min-h-screen flex-col items-center justify-center text-center p-4 md:p-24 dark:text-gray-400">
      <HiDocumentSearch className="text-7xl" />
      <p className="text-3xl font-bold mt-4 text-center">Ooops!!</p>
      <p className="text-xl font-bold text-center">
        The page you are looking for was not found!
      </p>
      <p className="text-sm text-center">
        You can go back to the home page and start from there
      </p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => router.push("/")}>
          Go back home
          <HiArrowRight />
        </Button>
      </div>

      <code className="text-red-700 absolute bottom-4 text-sm">404 error</code>
    </main>
  );
}
