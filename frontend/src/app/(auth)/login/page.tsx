import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { FiChevronLeft } from "react-icons/fi";
import UserAuthForm from "@/components/UserAuthForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const LoginPage = () => {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <FiChevronLeft className="mr-2 h-4 w-4" />
          Return Home
        </>
      </Link>
      <div className="lg:p-8">
        <div className="mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Image
              className="mx-auto mb-2"
              src="https://www.lifloelectronics.co.ke/wp-content/uploads/2021/10/kenya-police-logo-white.png"
              width={200}
              height={50}
              alt="Kenya Police Logo"
            />
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm max-w-xs mx-auto">
              Please enter your email and password to <strong>Access</strong>{" "}
              your account.
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
      <div className="hidden h-full bg-zinc-900 lg:block" />
    </div>
  );
};

export default LoginPage;