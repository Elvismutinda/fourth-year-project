import AppSidebar from "@/components/AppSidebar";
import { auth } from "../../../auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="relative flex h-screen w-full bg-[#1A1928]">
      <div className="fixed top-0 left-0 z-20 h-full">
        <AppSidebar user={session?.user ?? {}} />
      </div>
      <main className="ml-[4.25rem] flex-1 ">{children}</main>
    </div>
  );
}
