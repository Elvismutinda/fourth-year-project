import Chat from "@/components/chat/Chat";
import PDFViewer from "@/components/chat/PDFViewer";
import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

const ChatPage = async (props: ChatPageProps) => {
  const { chatId } = await props.params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  const _chats = await db.select().from(chat).where(eq(chat.userId, userId));
  if (!_chats || _chats.length === 0) {
    return redirect("/app/chat/new");
  }

  const currentChat = _chats.find((chat) => chat.id === chatId);
  return (
    <div className="flex h-screen overflow-scroll">
      <div className="flex w-full h-screen overflow-scroll">
        <div className="h-screen p-4 oveflow-scroll flex-[5] ">
          <PDFViewer fileUrl={currentChat?.fileUrl || ""} />
        </div>

        <div className="flex-[3] border-l border-[#2D2C3A]">
          <Chat chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
