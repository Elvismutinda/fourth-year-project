"use server";

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import {
  UpdatePasswordRequest,
  updatePasswordSchema,
  UpdateProfileRequest,
  updateProfileSchema,
} from "@/lib/validations/user";
import { db } from "@/lib/db";
import { chat, documents, message, user } from "@/lib/db/schema";
import { auth } from "../../../../auth";
import { getUserById } from "@/data/user";
import { and, eq, gt, inArray } from "drizzle-orm";
import { setHours, setMinutes, setSeconds, subDays } from "date-fns";
import { FREE_MESSAGE_LIMIT, PREMIUM_MESSAGE_LIMIT } from "@/config/settings";
import { getCachedUsage, setCachedUsage } from "@/lib/cache";

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

export const updateProfile = async (values: UpdateProfileRequest) => {
  const validatedFields = updateProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { firstName, lastName, phone } = validatedFields.data;
  const name = `${firstName} ${lastName}`;

  try {
    const session = await auth();

    if (!session || !session?.user) {
      return { error: "Unauthorized!" };
    }

    const userId = session.user.id;

    if (!userId) {
      return { error: "User ID is undefined!" };
    }

    await db.update(user).set({ name, phone }).where(eq(user.id, userId));

    return { success: "Profile updated. Login to reflect changes!" };
  } catch (error) {
    console.error("Failed to update profile", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteAccount = async () => {
  try {
    const session = await auth();

    if (!session || !session?.user) {
      return { error: "Unauthorized!" };
    }

    const userId = session.user.id;

    if (!userId) {
      return { error: "User ID is undefined!" };
    }

    // Get all chat IDs for the user
    const userChats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));
    const chatIds = userChats.map((c) => c.id);

    // Delete messages linked to the user's chats
    if (chatIds.length > 0) {
      await db.delete(message).where(inArray(message.chatId, chatIds));
    }

    // Delete chats
    await db.delete(chat).where(eq(chat.userId, userId));

    // Delete documents
    await db.delete(documents).where(eq(documents.userId, userId));

    // Delete user account
    await db.delete(user).where(eq(user.id, userId));

    return { success: "Account deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete account", error);
    return { error: "Something went wrong!" };
  }
};

export const deleteChatHistory = async () => {
  try {
    const session = await auth();

    if (!session || !session?.user) {
      return { error: "Unauthorized!" };
    }

    const userId = session.user.id;

    if (!userId) {
      return { error: "User ID is undefined!" };
    }

    // Find all chats by user
    const userChats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));
    const chatIds = userChats.map((c) => c.id);

    if (chatIds.length > 0) {
      // Delete associated messages
      await db.delete(message).where(inArray(message.chatId, chatIds));

      // Delete the chats
      await db.delete(chat).where(eq(chat.userId, userId));
    }

    return { success: "Chat history deleted successfully." };
  } catch (error) {
    console.error("Failed to delete chat history:", error);
    return { error: "Something went wrong while deleting chat history." };
  }
};

export const exportChatHistory = async () => {
  const session = await auth();

  if (!session || !session?.user) {
    return { error: "Unauthorized!" };
  }

  const userId = session.user.id;

  if (!userId) {
    return { error: "User ID is undefined!" };
  }

  // Get user's chats and associated messages
  const chats = await db.select().from(chat).where(eq(chat.userId, userId));

  const messagesByChat = await Promise.all(
    chats.map(async (c) => {
      const messages = await db
        .select()
        .from(message)
        .where(eq(message.chatId, c.id));
      return { ...c, messages };
    })
  );

  return { data: messagesByChat };
};

export const importChatHistory = async (importedChats: any[]) => {
  try {
    const session = await auth();

    if (!session || !session?.user) {
      return { error: "Unauthorized!" };
    }

    const userId = session.user.id;

    if (!userId) {
      return { error: "User ID is undefined!" };
    }

    for (const c of importedChats) {
      const chatId = uuidv4();

      console.log("Inserting chat:", c);

      // Ensure all required fields are present before insertion
      if (!c.fileName || !c.createdAt) {
        console.error(`Missing required fields in chat: ${JSON.stringify(c)}`);
        continue; // Skip this chat if required fields are missing
      }

      await db.insert(chat).values({
        id: chatId,
        fileName: c.fileName,
        fileUrl: c.fileUrl,
        userId,
        createdAt: new Date(c.createdAt || Date.now()),
        visibility: "private",
      });

      if (Array.isArray(c.messages)) {
        for (const m of c.messages) {
          console.log("Inserting message:", m);

          // Ensure message data is valid
          if (!m.role || !m.content || !m.createdAt) {
            console.error(`Invalid message data: ${JSON.stringify(m)}`);
            continue; // Skip this message if any required fields are missing
          }
          await db.insert(message).values({
            id: uuidv4(),
            chatId,
            role: m.role,
            content: m.content,
            createdAt: new Date(m.createdAt || Date.now()),
          });
        }
      }
    }

    return { success: "Chat history imported successfully." };
  } catch (err) {
    console.error(err);
    return { error: "Failed to import chat history." };
  }
};

export async function upgradeToPremium(email: string) {
  const now = new Date();
  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(now.getMonth() + 1);

  try {
    await db
      .update(user)
      .set({
        role: "PREMIUM",
        paystackSubscriptionStart: now,
        paystackSubscriptionEnd: oneMonthLater,
      })
      .where(eq(user.email, email));

    return { success: "Account upgraded to Premium! Enjoy." };
  } catch (error) {
    console.error("Failed to upgrade user:", error);
    return { error: "Failed to upgrade account!" };
  }
}

function getMessageLimit(role: "USER" | "PREMIUM") {
  return role === "PREMIUM" ? PREMIUM_MESSAGE_LIMIT : FREE_MESSAGE_LIMIT;
}

function getLastResetDate(role: "USER" | "PREMIUM"): Date {
  const now = new Date();

  if (role === "PREMIUM") {
    // Premium users have no reset time
    return new Date(0); // Epoch time
  } else {
    let resetTime = setSeconds(setMinutes(setHours(now, 3), 0), 0); // Today at 3:00 AM

    if (now < resetTime) {
      // If current time is before 3 AM, use yesterday's 3 AM
      resetTime = subDays(resetTime, 1);
    }

    return resetTime;
  }
}

export async function getUsageInfo() {
  const session = await auth();
  const currentUser = session?.user;

  if (!currentUser?.id) {
    throw new Error("Unauthorized or missing user ID.");
  }

  const [userData] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, currentUser.id));

  const role = userData?.role === "PREMIUM" ? "PREMIUM" : "USER";
  const messageLimit = getMessageLimit(role);

  // Check cache first
  const cached = getCachedUsage(currentUser.id, role);
  if (cached) {
    return {
      isPremium: role === "PREMIUM",
      totalUsed: cached.totalUsed,
      remaining: messageLimit - cached.totalUsed,
    };
  }

  // Count messages created after last reset
  const resetDate = getLastResetDate(role);

  const totalMessages = await db
    .select()
    .from(message)
    .innerJoin(chat, eq(chat.id, message.chatId))
    .where(
      and(
        eq(chat.userId, currentUser.id),
        gt(message.createdAt, resetDate) // Only messages after last 3AM
      )
    );

  const totalUsed = totalMessages.length;

  // Set cache
  setCachedUsage(currentUser.id, totalUsed);

  return {
    isPremium: role === "PREMIUM",
    totalUsed,
    remaining: messageLimit - totalUsed,
  };
}
