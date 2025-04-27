"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcutHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        router.push("/app/chat/new");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
