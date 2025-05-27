import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your account",
};

const VerifyEmailPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/login" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="default" className="bg-[#1A1928] hover:bg-[#1A1928]">
          <div className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to login
          </div>
        </Button>
      </Link>

      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
};

export default VerifyEmailPage;
