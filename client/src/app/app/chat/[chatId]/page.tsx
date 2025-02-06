import Chat from "@/components/chat/Chat";
import PDFViewer from "@/components/chat/PDFViewer";
import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  const _chats = await db.select().from(chat).where(eq(chat.userId, userId));
  if (!_chats || _chats.length === 0) {
    return redirect("/app/chat");
  }

  // const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          {/* <PDFViewer pdf_url={currentChat?.pdfUrl || ""} /> */}
          <PDFViewer pdf_url="" />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <Chat chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
