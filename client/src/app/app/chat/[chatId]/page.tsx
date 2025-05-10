import Chat from "@/components/chat/Chat";
import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { case_laws, chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import PDFRenderer from "@/components/chat/PDFRenderer";
import { Card, CardContent } from "@/components/ui/card";
import CaseLawChat from "@/components/chat/CaseLawChat";
import Link from "next/link";

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

interface CaseLaw {
  id: string;
  metadata: {
    citation: string;
  };
}

const ChatPage = async (props: ChatPageProps) => {
  const { chatId } = await props.params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  // Fetch current chat with joined case law
  const [current] = await db
    .select({
      chat,
      caseLaw: case_laws,
    })
    .from(chat)
    .leftJoin(case_laws, eq(chat.caseLawId, case_laws.id))
    .where(eq(chat.id, chatId));

  if (!current?.chat || current.chat.userId !== userId) {
    return redirect("/app/chat/new");
  }

  const currentChat = current.chat;
  const caseLaw = current.caseLaw as CaseLaw;

  return (
    <>
      {currentChat.type === "upload" ? (
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
      ) : (
        <div className="flex justify-center items-center w-full h-full p-16">
          <Card className="w-full h-full shadow-lg border border-gray-800">
            <CardContent className="h-full overflow-y-auto m-1">
              {caseLaw?.metadata?.citation && (
                <Link
                  href={`/app/caselaws/${caseLaw.id}`}
                  className="mx-auto my-3 flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100 max-w-fit p-4 px-3 py-1 text-center text-sm font-semibold"
                >
                  {caseLaw.metadata.citation.replace(/\s*copy\s*$/i, "")}
                </Link>
              )}
              {caseLaw && <CaseLawChat caseLawId={caseLaw.id} />}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatPage;
