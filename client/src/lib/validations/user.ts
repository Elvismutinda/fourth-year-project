import * as z from "zod";

export const updatePasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(1, "New password is required"),
    confirmNewPassword: z
      .string({ required_error: "Confirm your new password" })
      .min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;
