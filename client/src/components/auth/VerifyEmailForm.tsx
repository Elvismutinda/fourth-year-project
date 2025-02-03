"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { verifyEmail } from "@/app/(auth)/verify-email/actions";
import { toast } from "sonner";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      toast.error("Missing token");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success(data?.success);
        }
      })
      .catch(() => {
        toast.error("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="w-[400px] shadow-md flex flex-col items-center justify-center text-center">
      <CardHeader>
        <CardTitle>Account Verification</CardTitle>
        <CardDescription>Verifying your email address</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center w-full justify-center">
          <BeatLoader />
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyEmailForm;
