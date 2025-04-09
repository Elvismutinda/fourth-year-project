import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chat, message as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { deleteChatById, getChatById } from "@/app/app/chat/actions";
import { llm } from "@/lib/ai/hf_llm";

export async function POST(req: Request) {
  // const { chatId, messages }: { chatId: string; messages: Array<UIMessage> } = await req.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages, chatId } = await req.json();
    const _chats = await db.select().from(chat).where(eq(chat.id, chatId));

    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileUrl = _chats[0].fileUrl;
    const lastMessage = messages[messages.length - 1];

    let context = "";

    if (fileUrl) {
      context = await getContext(lastMessage.content, fileUrl);
    }

    const response = await llm(lastMessage.content, context);

    console.log("Response:", response);

    await db.insert(_messages).values([
      {
        chatId,
        content: lastMessage.content,
        role: "user",
        createdAt: new Date(),
      },
      { chatId, content: response, role: "assistant", createdAt: new Date() },
    ]);

    return NextResponse.json({ message: response }, { status: 200 });
  } catch (error) {
    console.log("Error in POST /api/chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chat = await getChatById({ chatId });

    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteChatById({ id: chatId });

    return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
