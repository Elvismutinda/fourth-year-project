export default async function DraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center w-full min-h-screen py-4 md:py-20 md:px-24 bg-[#1A1928]">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
