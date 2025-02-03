import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="default" className="bg-[#0c1428] hover:bg-[#0c1428]">
          <div className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go home
          </div>
        </Button>
      </Link>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
