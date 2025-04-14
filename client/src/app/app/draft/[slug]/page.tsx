import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { documents } from "@/config/documents";
import { notFound } from "next/navigation";
import DescriptionRenderer from "@/components/draft/DescriptionRenderer";
import DraftForm from "@/components/draft/DraftForm";

type DraftPageProps = {
  params: {
    slug: string;
  };
};

// Flatten the nested documents for lookup
const allDocs = documents.flatMap((category) =>
  category.documents.map((doc) => ({
    ...doc,
    category: category.category,
  }))
);

export default async function SlugDraftPage({ params }: DraftPageProps) {
  const doc = allDocs.find((d) => d.slug === params.slug);

  if (!doc) return notFound();

  return (
    <div className="mx-auto py-8 px-4">
      <Link
        href="/app/draft"
        className="absolute left-20 top-4 md:left-44 md:top-8"
      >
        <Button className="bg-[#0c1428]/80 hover:bg-[#0c1428]">
          <div className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go back
          </div>
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">{doc.name}</h1>
      <div className="flex flex-col-reverse lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/2">
        <h1 className="text-xl font-bold mb-2 underline">Input your details:</h1>
          <DraftForm fields={doc.fields} documentType={doc.name} />
        </div>
        <div className="w-full lg:w-1/2">
        <h1 className="text-xl font-bold mb-2 underline">Summary</h1>
          <DescriptionRenderer description={doc.description} />
        </div>
      </div>
    </div>
  );
}
