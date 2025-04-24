export default async function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
