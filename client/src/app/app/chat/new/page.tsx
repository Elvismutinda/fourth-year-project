import { db } from "@/lib/db";
import { auth } from "../../../../../auth";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  const isAuth = !!userId;
  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chat).where(eq(chat.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="min-h-screen ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Upload Document</h1>
          </div>

          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/app/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-300">
            Upload your pdf document to get started with the research tool.
          </p>

          {/* <span>Hello {userId}</span> */}
          <div className="w-full mt-4">{isAuth && <FileUpload />}</div>
        </div>
      </div>
    </div>
  );
}
