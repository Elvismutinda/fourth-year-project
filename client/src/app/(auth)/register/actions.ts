"use server";

import { RegisterRequest, RegisterSchema } from "@/lib/validations/auth";

export const register = async (values: RegisterRequest) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  return { success: "Email sent!" };
};
