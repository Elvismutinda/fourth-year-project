export default async function DraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center w-full h-full py-4 md:py-20 md:px-24">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
