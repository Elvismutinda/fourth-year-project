"use server";

import { db } from "@/lib/db";
import { case_laws, chat, documents, message, user } from "@/lib/db/schema";
import { RecentUpload } from "@/types";
import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAdminStats = async () => {
  const [{ count: userCount }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(user);

  const [{ count: chatCount }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(chat);

  const [{ count: messageCount }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(message);

  const [{ count: documentCount }] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${documents.fileUrl})` })
    .from(documents);

  return {
    userCount,
    chatCount,
    messageCount,
    documentCount,
  };
};

export async function getAllUsers() {
  const users = await db.select().from(user).orderBy(user.name);
  return users;
}

export async function deleteUser(userId: string) {
  try {
    if (!userId) {
      return { error: "User ID is required!" };
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

    revalidatePath("/admin");
    return { success: "User deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete user", error);
    return { error: "Something went wrong while deleting user!" };
  }
}

export async function getUploadChatReports() {
  const uploadsRaw = await db.execute(sql`
    SELECT 
      EXTRACT(DOW FROM "createdAt") AS day_of_week,
      COUNT(*) AS count
    FROM ${chat}
    WHERE type = 'upload'
    GROUP BY day_of_week
    ORDER BY day_of_week
  `);

  const uploadsPerWeek = uploadsRaw.rows.map((row) => ({
    day_of_week: Number(row.day_of_week),
    count: Number(row.count),
  }));

  return {
    uploadsPerWeek,
  };
}

// To add a limit, you can add limit = 10 as a parameter to the function and in the sql query add LIMIT ${limit} at the bottom
export async function getRecentUploads() {
  const result = await db.execute(sql`
    SELECT 
      ch."file_name" AS file_name,
      u.name AS user,
      SUM(LENGTH(d.content)::int) / 1024 AS size_kb,
      MAX(ch."createdAt")::date AS date_uploaded,
      COUNT(DISTINCT m.id) AS chats_started
    FROM ${documents} d
    JOIN ${user} u ON d."userId" = u.id
    LEFT JOIN ${chat} ch ON d.file_url = ch."file_url"
    LEFT JOIN ${message} m ON ch.id = m."chatId"
    WHERE ch.type = 'upload'
    GROUP BY ch."file_name", u.name, d.file_url
    ORDER BY date_uploaded DESC
  `);

  return result.rows as RecentUpload[];
}

export async function getChatActivityOverTime() {
  return await db.execute(sql`
    SELECT 
      DATE_TRUNC('month', "createdAt") AS month,
      type,
      COUNT(*) AS count
    FROM ${chat}
    GROUP BY month, type
    ORDER BY month ASC
  `);
}

export async function getMostUsedCaseLaws(limit = 10) {
  const result = await db.execute(sql`
    SELECT 
      cl.id,
      cl.url,
      cl.metadata,
      COUNT(c.id) AS chat_count
    FROM ${chat} c
    JOIN ${case_laws} cl ON c."caseLawId" = cl.id
    WHERE c.type = 'case_law'
    GROUP BY cl.id, cl.url, cl.metadata
    ORDER BY chat_count DESC
    LIMIT ${limit}
  `);

  return result.rows;
}
