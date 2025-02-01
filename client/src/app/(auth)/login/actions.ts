"use server";

import { LoginRequest, LoginSchema } from "@/lib/validations/auth";

export const login = async (values: LoginRequest) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return { success: "Email sent!" };
};
