import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Full name is required"),
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string({ required_error: "Confirm your password" })
      .min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
