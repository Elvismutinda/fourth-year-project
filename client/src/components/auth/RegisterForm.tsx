"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { siteConfig } from "@/config/site";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { RegisterRequest, RegisterSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { register } from "@/app/(auth)/register/actions";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = (values: RegisterRequest) => {
    startTransition(() => {
      register(values).then((data) => {
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
          onSubmit={form.handleSubmit(handleRegister)}
          className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[360px] min-w-[320px]"
        >
          <div className="flex flex-col">
            <header className="block space-y-3">
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/assets/icons/intelaw-logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <p className="text-[#fff] text-2xl font-bold">
                  {siteConfig.name}
                </p>
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
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#fff]"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#fff]"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="text-sm text-slate-400">
            By submitting, I agree to the{" "}
            <Link
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#32c06b] underline"
            >
              Terms and Conditions{" "}
            </Link>
            and{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#32c06b] underline"
            >
              Privacy Policy.
            </Link>
          </p>

          <div>
            <Button
              variant="main"
              type="submit"
              className="h-10 w-full"
              disabled={isPending}
            >
              Register
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
