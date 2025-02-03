import AppSidebar from "@/components/AppSidebar";
import { auth } from "../../../auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen w-full">
      <AppSidebar user={session?.user ?? {}} />
      {children}
    </div>
  );
}
