import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "../../../../auth";
import { getCaseLawById } from "@/app/app/caselaws/actions";
import { message as _messages, chat } from "@/lib/db/schema";
import { chat_llm } from "@/lib/ai/hf_llm";
import { getCaseContext } from "@/lib/context";
import { and, eq } from "drizzle-orm";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages, caseLawId } = await req.json();
    const userId = session.user.id;
    const _caseLaw = await getCaseLawById(caseLawId);

    if (!_caseLaw) {
      return NextResponse.json(
        { error: "Case law not found" },
        { status: 404 }
      );
    }

    interface CaseMetadata {
      citation?: string;
    }

    const metadata = _caseLaw.metadata as CaseMetadata;
    const citation = metadata?.citation;
    const lastMessage = messages[messages.length - 1];

    let context = "";

    context = await getCaseContext(lastMessage.content, caseLawId);

    const response = await chat_llm(lastMessage.content, context);

    console.log("Response:", response);

    // Check if a chat already exists for the user + caseLawId
    const [existingChat] = await db
      .select()
      .from(chat)
      .where(and(eq(chat.userId, userId), eq(chat.caseLawId, caseLawId)))
      .limit(1);

    let chatId = existingChat?.id;

    if (!chatId) {
      const [newChat] = await db
        .insert(chat)
        .values({
          userId,
          caseLawId,
          fileName: citation,
          type: "case_law",
          createdAt: new Date(),
        })
        .returning({ id: chat.id });

      chatId = newChat.id;
    }

    await db.insert(_messages).values([
      {
        chatId,
        caseLawId,
        content: lastMessage.content,
        role: "user",
        createdAt: new Date(),
      },
      {
        chatId,
        caseLawId,
        content: response,
        role: "assistant",
        createdAt: new Date(),
      },
    ]);

    return NextResponse.json({ message: response }, { status: 200 });
  } catch (error) {
    console.log("Error in POST /api/caselaws:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
