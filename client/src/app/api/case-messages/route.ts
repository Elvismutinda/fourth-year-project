import { db } from "@/lib/db";
import { chat, message } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseLawId } = await req.json();
  const userId = session.user.id;

  // 1. Find chat for user and caseLawId
  const [existingChat] = await db
    .select()
    .from(chat)
    .where(and(eq(chat.userId, userId), eq(chat.caseLawId, caseLawId)))
    .limit(1);

  if (!existingChat) {
    return NextResponse.json([], { status: 200 }); // No messages if no chat
  }

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, existingChat.id));

  return NextResponse.json(messages, { status: 200 });
};
