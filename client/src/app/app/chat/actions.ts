"use server";

import { VisibilityType } from "@/components/chat/VisibilitySelector";
import { updateChatVisiblityById } from "@/data/chat";
import { db } from "@/lib/db";
import { chat, message } from "@/lib/db/schema";
import { generateText, Message } from "ai";
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

export async function getChatById({ chatId }: { chatId: string }) {
  try {
    const [selectedChat] = await db
      .select()
      .from(chat)
      .where(eq(chat.id, chatId));

    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

// export async function generateTitleFromUserMessage({
//   message,
// }: {
//   message: Message;
// }) {
//   const { text: title } = await generateText({
//     model: myProvider.languageModel("title-model"),
//     system: `\n
//     - you will generate a short title based on the first message a user begins a conversation with
//     - ensure it is not more than 80 characters long
//     - the title should be a summary of the user's message
//     - do not use quotes or colons`,
//     prompt: JSON.stringify(message),
//   });

//   return title;
// }

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
