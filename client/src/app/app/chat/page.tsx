import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import Chat from "@/components/chat/Chat";
import PDFViewer from "@/components/chat/PDFViewer";

export default async function ChatPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5] ">
          {/* <PDFViewer pdf_url={currentChat?.pdfUrl || ""} /> */}
          <PDFViewer fileUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l border-[#2D2C3A]">
          <Chat chatId={1} />
        </div>
      </div>
    </div>
  );
}
