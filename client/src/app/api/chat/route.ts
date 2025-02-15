import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chat, message as _messages } from "@/lib/db/schema";
import { Message, streamText } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";
import { auth } from "../../../../auth";
import { deleteChatById, getChatById } from "@/app/app/chat/actions";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  // const { chatId, messages }: { chatId: string; messages: Array<Message> } = await req.json();

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

    if (!fileUrl) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const context = await getContext(lastMessage.content, fileUrl);

    const prompt = {
      role: "system",
      content: `You are a highly formal AI legal assistant, designed to provide clear, concise, and professional responses to legal inquiries.
        Your primary role is to assist users with legal research by retrieving relevant case law and statutory provisions from the provided context.
        If the context does not contain the answer, respond with: "I'm sorry, but I cannot provide an answer based on the available information."
        Avoid making assumptions or providing speculative answers.
        Speak in a calm, precise, and authoritative manner, maintaining legal professionalism.
        
        CONTEXT BLOCK:
        ${context}
        END OF CONTEXT BLOCK.`,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });

    const result = streamText.toDataStreamResponse(response, {
      onStart: async () => {
        await db.insert(_messages).values({
          chatId,
          content: lastMessage.content,
          role: "user",
          createdAt: new Date(),
        });
      },
      onCompletion: async (completion: string) => {
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: "system",
          createdAt: new Date(),
        });
      },
    });

    return result;
  } catch (error) {
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
    const chat = await getChatById({ id: chatId });

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
