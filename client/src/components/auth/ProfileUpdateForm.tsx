"use client";

import { useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateProfileRequest,
  updateProfileSchema,
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
import { updateProfile } from "@/app/app/setting/actions";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";

const ProfileUpdateForm = () => {
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();

  const [firstName, lastName] = user?.name?.split(" ") || [
    "",
    "",
  ];

  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
    },
  });

  const handleProfileUpdate = (values: UpdateProfileRequest) => {
    startTransition(() => {
      updateProfile(values).then((data) => {
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
          onSubmit={form.handleSubmit(handleProfileUpdate)}
          className="mx-auto sm:mx-0 sm:pl-8 flex w-full flex-col space-y-6 max-w-[360px] min-w-[320px]"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="First name"
                    type="text"
                    className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                  />
                </FormControl>
                <FormMessage />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Last name"
                    type="text"
                    className="h-11 bg-gray-700/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                  />
                </FormControl>
                <FormMessage />
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
              Save
              {isPending && <LoaderCircle className="animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProfileUpdateForm;
