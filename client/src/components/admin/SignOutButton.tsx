"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    Cookies.remove("accessKey");
    router.push("/login");
  };

  return (
    <Button variant="outline" className="text-black" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
