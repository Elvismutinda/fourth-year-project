"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { siteConfig } from "@/config/site";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { RegisterRequest, RegisterSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { toast } from "sonner";
import { register } from "@/app/(auth)/register/actions";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleRegister = (values: RegisterRequest) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.success);
        }
      });
    })
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[360px] min-w-[320px]"
        >
          <div className="flex flex-col">
            <header className="block space-y-3">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/assets/images/logosaas.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <p className="text-[#fff] text-2xl font-bold">{siteConfig.name}</p>
              </div>
              <h1 className="text-2xl font-bold text-[#fff] tracking-tight">
                Create an account
              </h1>
            </header>
            <p className="pt-1 text-base text-slate-400">
              Create an account to access the research tool.
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Name"
                    type="text"
                    className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Password"
                      type="password"
                      className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Confirm Password"
                      type="password"
                      className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <p className="text-sm text-slate-400">
            By submitting, I agree to the Terms and Conditions and Privacy Policy.
          </p>

          <div>
            <Button variant="main" type="submit" className="h-10 w-full" disabled={isPending}>
              Register
              {isPending && <LuLoaderCircle className="h-4 w-4 animate-spin" />}
            </Button>
          </div>
          
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-[#32c06b] underline">
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
