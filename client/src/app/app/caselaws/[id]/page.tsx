import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, SquareArrowOutUpRight } from "lucide-react";
import { getCaseLawById, getSimilarCases } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CaseLawChat from "@/components/chat/CaseLawChat";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { getChatById } from "../../chat/actions";

type CaselawPageProps = {
  params: {
    id: string;
  };
};

const CaselawPage = async (props: CaselawPageProps) => {
  const { id } = await props.params;

  const caseLaw = (await getCaseLawById(id)) as {
    metadata: {
      citation: string;
      court: string;
      court_station: string;
      type: string;
      case_number: string;
      judges: string;
    };
    file_url: string;
    url: string;
    content: string;
  };

  if (!caseLaw) {
    return <p className="text-center text-red-500">Case law not found.</p>;
  }

  const similarCases = (await getSimilarCases(id)) as {
    id: string;
    metadata: {
      citation: string;
      court: string;
      case_number: string;
      judges: string;
    };
  }[];

  return (
    <div className="rounded-md p-6">
      <h2 className="mb-4 text-center text-base font-bold sm:text-lg">
        {caseLaw.metadata.citation.replace(/\s*copy\s*$/i, "")}
      </h2>
      <div className="flex flex-col gap-2 py-2 sm:flex-row sm:justify-end sm:py-4">
        {caseLaw.file_url && (
          <Link href={caseLaw.file_url} target="_blank">
            <Button variant="main">
              <Download />
              Download Case File
            </Button>
          </Link>
        )}

        {caseLaw.url && (
          <Link href={caseLaw.url} target="_blank">
            <Button variant="purple">
              <SquareArrowOutUpRight />
              View in KLR
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="ai-chat" className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-4">
          <TabsTrigger value="ai-chat">AI Chat</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="principles">Legal Principles</TabsTrigger>
          <TabsTrigger value="ratio">Ratio Decidendi</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
          <TabsTrigger value="case-details">Case Details</TabsTrigger>
          <TabsTrigger value="full-text">Full Case Law</TabsTrigger>
          <TabsTrigger value="similar-cases">Similar Cases</TabsTrigger>
        </TabsList>
        <TabsContent value="ai-chat">
          <div>
            <div className="relative m-4 min-h-0 min-w-0 rounded-2xl border-gray-500 bg-gray-200 md:m-10">
              <CaseLawChat chatId={id} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <p>Issues</p>
        </TabsContent>

        <TabsContent value="principles">
          <p>Legal Principles</p>
        </TabsContent>

        <TabsContent value="ratio">
          <p>Ratio Decidendi</p>
        </TabsContent>

        <TabsContent value="reasoning">
          <p>Reasoning</p>
        </TabsContent>

        <TabsContent value="case-details">
          <div>
            <div className="rounded-lg p-2 sm:p-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[200px,1fr]">
                <strong className="text-sm sm:text-base">Case Citation:</strong>
                <span className="text-sm sm:text-base">
                  {caseLaw.metadata.citation.replace(/\s*copy\s*$/i, "")}
                </span>
                <strong className="text-sm sm:text-base">Court:</strong>
                <span className="text-sm sm:text-base">
                  {caseLaw.metadata["court"]}
                </span>
                <strong className="text-sm sm:text-base">Court Station:</strong>
                <span className="text-sm sm:text-base">
                  {caseLaw.metadata["court_station"]}
                </span>
                <strong className="text-sm sm:text-base">Case Type:</strong>
                <span className="text-sm sm:text-base">
                  {caseLaw.metadata["type"]}
                </span>
                <strong className="text-sm sm:text-base">Case Number:</strong>
                <span className="text-sm sm:text-base">
                  {caseLaw.metadata["case_number"]}
                </span>
                <strong className="text-sm sm:text-base">Judges:</strong>
                <span className="text-sm sm:text-base">
                  {caseLaw.metadata["judges"]}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="full-text">
          <div>{caseLaw.content}</div>
        </TabsContent>

        <TabsContent value="similar-cases">
          <div>
            <div className="scrollbar-custom mr-1 h-full overflow-y-auto">
              <div className="px-5 sm:pt-8">
                <main className="w-full px-4">
                  {similarCases.length > 0 ? (
                    <ul className="flex flex-col space-y-4">
                      {similarCases.map((similar, index) => (
                        <Link
                          key={index}
                          href={`/app/caselaws/${similar.id}`}
                          className="block"
                        >
                          <Card className="cursor-pointer transition-transform hover:scale-[1.02]">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold">
                                {similar.metadata.citation.replace(
                                  /\s*copy\s*$/i,
                                  ""
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 py-2">
                                <p>
                                  <strong>Court:</strong>{" "}
                                  {similar.metadata["court"]}
                                </p>
                                <p>
                                  <strong>Case Number:</strong>{" "}
                                  {similar.metadata["case_number"]}
                                </p>
                                <p>
                                  <strong>Judges:</strong>{" "}
                                  {similar.metadata["judges"]}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No similar cases found.</p>
                    </div>
                  )}
                </main>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaselawPage;
