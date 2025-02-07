import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { loadCloudinaryToNeon } from "@/lib/neon";
import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_url, file_name } = body;
    console.log("Processing file: ", file_url, file_name);

    // Load PDF from cloudinary and store embeddings in NeonDB
    await loadCloudinaryToNeon(file_url, userId);

    // Insert chat metadata into database
    const chat_id = await db
      .insert(chat)
      .values({
        fileName: file_name,
        fileUrl: getCloudinaryUrl(file_url),
        userId,
      })
      .returning({
        insertedId: chat.id,
      });

    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating chat", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
