import { db } from "@/lib/db";
import { auth } from "../../../../auth";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { redirect } from "next/navigation";
import Chat from "@/components/chat/Chat";
import PDFViewer from "@/components/chat/PDFViewer";

export default async function Home() {
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) {
      return redirect("/login");
    }
  
    const _chats = await db.select().from(chat).where(eq(chat.userId, userId));
    // if (!_chats || _chats.length === 0) {
    //   return redirect("/app/chat");
    // }
  // const session = await auth();
  // const userId = session?.user.id;
  // const isAuth = !!userId;
  // let firstChat;

  // if (userId) {
  //   firstChat = await db.select().from(chat).where(eq(chat.userId, userId));
  //   if (firstChat) {
  //     firstChat = firstChat[0];
  //   }
  // }

  return (
    <div className="flex h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5] ">
          {/* <PDFViewer pdf_url={currentChat?.pdfUrl || ""} /> */}
          <PDFViewer pdf_url="" />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l border-border">
          <Chat chatId={1} />
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
  //     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //       <div className="flex flex-col items-center text-center">
  //         <div className="flex items-center">
  //           <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
  //         </div>

  //         <div className="flex mt-2">
  //           {isAuth && firstChat && (
  //             <>
  //               <Link href={`/chat/${firstChat.id}`}>
  //                 <Button>
  //                   Go to Chats <ArrowRight className="ml-2" />
  //                 </Button>
  //               </Link>
  //             </>
  //           )}
  //         </div>

  //         <p className="max-w-xl mt-1 text-lg text-slate-600">
  //           Join millions of students, researchers and professionals to
  //           instantly answer questions and understand research with AI
  //         </p>

  //         <span>Hello {userId}</span>
  //         <div className="w-full mt-4">{isAuth && <FileUpload />}</div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
