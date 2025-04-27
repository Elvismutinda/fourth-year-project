import Chat from "@/components/chat/Chat";
import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import PDFRenderer from "@/components/chat/PDFRenderer";

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
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6 overflow-y-auto">
            {/* Main area */}
            <PDFRenderer fileUrl={currentChat?.fileUrl || ""} />
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-[#2D2C3A] lg:w-96 lg:border-l lg:border-t-0">
          <Chat chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
