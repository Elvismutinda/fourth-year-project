import { draft_llm } from "@/lib/ai/hf_llm";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { documentType, fieldDetails } = await req.json();

    console.log("Received document type:", documentType);
    console.log("Received field details:", fieldDetails);

    // Call draft_llm to generate the document
    const document = await draft_llm(documentType, fieldDetails);

    // Return the generated document as a response
    return NextResponse.json({ document }, { status: 200 });
  } catch (error) {
    console.log("Error in POST /api/draft:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}