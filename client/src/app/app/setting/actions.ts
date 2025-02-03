"use server";

import bcrypt from "bcryptjs";
import {
  UpdatePasswordRequest,
  updatePasswordSchema,
} from "@/lib/validations/user";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { auth } from "../../../../auth";
import { getUserById } from "@/data/user";
import { eq } from "drizzle-orm";

export const updatePassword = async (values: UpdatePasswordRequest) => {
  const validatedFields = updatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password, newPassword } = validatedFields.data;

  try {
    const session = await auth();

    if (!session || !session?.user) {
      return { error: "Unauthorized!" };
    }

    const userId = session.user.id;

    if (!userId) {
      return { error: "User ID is undefined!" };
    }

    const existingUser = await getUserById(userId);

    if (!existingUser || existingUser.length === 0) {
      return { error: "User not found!" };
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser[0].password
    );

    if (!passwordsMatch) {
      return { error: "Incorrect current password!" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, userId));

    return { success: "Password updated. Login with new password!" };
  } catch (error) {
    console.error("Failed to update password", error);
    return { error: "Something went wrong!" };
  }
};
