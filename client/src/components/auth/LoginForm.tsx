"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

import { siteConfig } from "@/config/site";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
// import { FcGoogle } from "react-icons/fc";
// import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequest, LoginSchema } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { login } from "@/app/(auth)/login/actions";
import { toast } from "sonner";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (values: LoginRequest) => {
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success(data?.success);
        }
      });
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[360px] min-w-[320px]"
        >
          <div className="flex flex-col">
            <header className="block space-y-3">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/assets/icons/logosaas.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <p className="text-[#fff] text-2xl font-bold">
                  {siteConfig.name}
                </p>
              </div>
              <h1 className="text-2xl font-bold text-[#fff] tracking-tight">
                Log in
              </h1>
            </header>
            <p className="pt-1 text-base text-slate-400">
              Enter your email and password to log in to your account.
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Email"
                    type="email"
                    className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <p className="text-sm underline text-[#32c06b] cursor-pointer">
            Forgot password?
          </p> */}

          <div>
            <Button
              variant="main"
              type="submit"
              className="h-10 w-full"
              disabled={isPending}
            >
              Login
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            </Button>
          </div>
          <p className="text-sm text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#32c06b] underline">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>

      {/* <Separator className="my-4 bg-slate-300" />

      <div className="flex flex-col gap-y-2.5">
        <Button
          disabled={false}
          onClick={() => {}}
          variant="outline"
          size="lg"
          className="w-full flex flex-row"
        >
          <FcGoogle className="size-5 mr-2" />
          Continue with Google
        </Button>
      </div> */}
    </>
  );
};

export default LoginForm;
