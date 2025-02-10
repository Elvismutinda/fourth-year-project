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

export const updateProfileSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  phone: z
  .string()
  .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
