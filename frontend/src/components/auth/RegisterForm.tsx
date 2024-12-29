"use client";

import { Button, Input, Spinner } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logoImage from "../../../public/images/logosaas.png";
import { siteConfig } from "@/config/site";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
  }
  return (
    <form
      onSubmit={handleLogin}
      className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[360px] min-w-[320px]"
    >
      <div className="flex flex-col">
        <header className="block space-y-3">
          <div className="flex flex-row items-center gap-2">
            <Image src={logoImage} alt="logo" className="h-12 w-12" />
            <p className="text-white text-2xl font-semibold">{siteConfig.name}</p>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create an account
          </h1>
        </header>
        <p className="pt-1 text-base text-slate-400">
          Create an account to access the research tool.
        </p>
      </div>
      <Input
        aria-label="email"
        name="email"
        type="text"
        label="Email"
        defaultValue=""
        variant="flat"
        color="default"
        size="sm"
      />

      <Input
        aria-label="password"
        name="password"
        type="password"
        label="Password"
        defaultValue=""
        variant="flat"
        size="sm"
      />

      <Input
        aria-label="confirm password"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        defaultValue=""
        variant="flat"
        size="sm"
      />

      <p className="text-sm text-slate-400">
        By submitting, I agree to the Terms and Conditions and Privacy Policy.
      </p>

      <div>
        <Button
          type="submit"
          size="md"
          variant="solid"
          className="w-full bg-[#61bd73] text-[#130c49]"
        >
          {isLoading ? <Spinner color="white" /> : <span>Sign up</span>}
        </Button>
      </div>
      <p className="text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-[#32c06b] underline">
          Log in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
