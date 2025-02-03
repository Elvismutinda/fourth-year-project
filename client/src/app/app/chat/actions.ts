"use server";

import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from db");
    throw error;
  }
}
