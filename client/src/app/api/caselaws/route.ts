import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "../../../../auth";
import { getCaseLawById } from "@/app/app/caselaws/actions";
import { message as _messages, case_law_chunks, chat } from "@/lib/db/schema";
import { getCaseContext } from "@/lib/context";
import { and, eq } from "drizzle-orm";
import { HfInference } from "@huggingface/inference";
import { Message } from "ai";
import { loadCaseLawToNeon } from "@/lib/caselawLoader";

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  throw new Error("Missing Hugging Face API token");
}

const hf = new HfInference(HF_TOKEN);

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

    const [chunkExists] = await db
      .select({ id: case_law_chunks.id })
      .from(case_law_chunks)
      .where(eq(case_law_chunks.caseLawId, caseLawId))
      .limit(1);

    if (!chunkExists) {
      await loadCaseLawToNeon({ id: _caseLaw.id, content: _caseLaw.content });
    }

    interface CaseMetadata {
      citation?: string;
    }

    const metadata = _caseLaw.metadata as CaseMetadata;
    const citation = metadata?.citation;
    const lastMessage = messages[messages.length - 1];

    let context = "";

    context = await getCaseContext(lastMessage.content, caseLawId);

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
