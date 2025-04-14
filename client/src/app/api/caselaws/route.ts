import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { case_laws, chat, message } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";
import { chat_llm } from "@/lib/ai/hf_llm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const judge = searchParams.get("judge");
    const query = searchParams.get("query");
    const court = searchParams.get("court");
    const topic = searchParams.get("topic");

    let caseQuery = db
      .select({
        id: case_laws.id,
        url: case_laws.url,
        file_url: case_laws.file_url,
        metadata: case_laws.metadata,
      })
      .from(case_laws);

    if (judge) {
      caseQuery = caseQuery.where(eq(case_laws.metadata.judges, judge));
    }

    if (court) {
      caseQuery = caseQuery.where(eq(case_laws.metadata.court, court));
    }

    if (topic) {
      caseQuery = caseQuery.where(eq(case_laws.metadata.court_division, topic));
    }

    if (query) {
      caseQuery = caseQuery.where(
        like(case_laws.metadata.case_number, `%${query}%`)
      );
    }

    const cases = await caseQuery;
    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching case laws:", error);
    return NextResponse.json(
      { error: "Failed to fetch case laws" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseLawId, chatId, userId, messages } = body;

    if (!messages || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let currentChatId = chatId;

    // 1. Create a new chat if one wasn't passed
    if (!currentChatId) {
      const newChat = await db.insert(chat).values({
        userId,
        caseLawId,
        title: `Chat on Case Law #${caseLawId}`,
      }).returning({ id: chat.id });

      currentChatId = newChat[0].id;
    }

    // 2. Get case law context
    const caseLaw = await db.query.case_laws.findFirst({
      where: eq(case_laws.id, caseLawId),
    });

    const lastMessage = messages[messages.length - 1];

    const context = caseLaw?.content || "";

    // 3. Save the user message
    // await db.insert(message).values({
    //   chatId: currentChatId,
    //   role: "user",
    //   content: lastMessage.content,
    //   createdAt: new Date(),
    // });

    // 4. Generate AI response
    const response = await chat_llm(lastMessage.content, context);

    await db.insert(message).values([
      {
        chatId: currentChatId,
        role: "user",
        content: lastMessage.content,
        createdAt: new Date(),
      },
      { chatId: currentChatId, content: response, role: "assistant", createdAt: new Date() },
    ]);

    // 5. Save the assistant response
    // await db.insert(messages).values({
    //   chatId: currentChatId,
    //   role: "assistant",
    //   content: response,
    // });

    return NextResponse.json({ chatId: currentChatId, response });
  } catch (err) {
    console.error("[caselaw_chat_error]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
