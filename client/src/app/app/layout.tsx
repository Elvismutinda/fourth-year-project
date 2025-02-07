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
      <div className="z-20">
        <AppSidebar user={session?.user ?? {}} />
      </div>
      {children}
    </div>
  );
}
