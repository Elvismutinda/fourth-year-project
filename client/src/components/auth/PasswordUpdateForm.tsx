"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdatePasswordRequest,
  updatePasswordSchema,
} from "@/lib/validations/user";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { updatePassword } from "@/app/app/setting/actions";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { signOut } from "next-auth/react";

const PasswordUpdateForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdatePasswordRequest>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handlePasswordUpdate = (values: UpdatePasswordRequest) => {
    startTransition(() => {
      updatePassword(values).then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success(data?.success);

          signOut({ callbackUrl: "/login" });
        }
      });
    });
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePasswordUpdate)}
          className="mx-auto sm:mx-0 sm:pl-8 flex w-full flex-col space-y-6 max-w-[360px] min-w-[320px]"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter current password"
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter new password"
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
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Confirm new password"
                    type="password"
                    className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              variant="main"
              type="submit"
              className="h-10"
              disabled={isPending}
            >
              Update
              {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PasswordUpdateForm;
