import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chat, message as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { deleteChatById, getChatById } from "@/app/app/chat/actions";
import { Message } from "ai";
import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  throw new Error("Missing Hugging Face API token");
}

const hf = new HfInference(HF_TOKEN);

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

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

    const prompt = {
      role: "system",
      content: `You are Intelaw, an advanced AI legal research assistant, specifically tailored to assist legal practitioners in Kenyan law. Your expertise lies in conducting thorough legal research and providing insightful legal analysis.
      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK
      Your task is to accurately and comprehensively address the user legal query, prioritizing the use of the provided context only if it enhances the response. For identity or informational queries, respond without utilizing the context.\n.
      Maintain a formal, professional tone. Reference case law and constitutional provisions if relevant.
      `,
    };

    let response = "";
    for await (const chunk of hf.chatCompletionStream({
      model: "HuggingFaceH4/zephyr-7b-beta",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      max_tokens: 512,
      temperature: 0.7,
    })) {
      if (chunk.choices && chunk.choices.length > 0) {
        response += chunk.choices[0].delta.content;
      }
    }

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
