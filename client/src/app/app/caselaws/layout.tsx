import { Card, CardContent } from "@/components/ui/card";

export default async function CaseLawsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center w-full h-full p-16">
      <Card className="bg-transparent/40 w-full h-full shadow-lg border border-gray-800">
        <CardContent className="h-full overflow-y-auto m-1">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
