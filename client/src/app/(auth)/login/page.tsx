import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import PasskeyModal from "@/components/admin/PasskeyModal";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

declare type SearchParamProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const LoginPage = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams.admin === "true";

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      {isAdmin && <PasskeyModal />}

      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="default" className="bg-[#1A1928] hover:bg-[#1A1928]">
          <div className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go home
          </div>
        </Button>
      </Link>

      <LoginForm />

      <div className="absolute right-4 bottom-4 md:right-8 md:bottom-8">
        {isAdmin && <PasskeyModal />}
        <Link
          href="/login/?admin=true"
          className="text-green-500 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm h-9 px-4 py-2 mt-2 sm:mt-0 bg-muted/10 hover:bg-muted/15 border-none"
        >
          Admin
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
