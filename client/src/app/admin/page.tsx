import Image from "next/image";
import {
  getAdminStats,
  getRecentUploads,
  getUploadChatReports,
  getChatActivityOverTime,
  getAllUsers,
  getMostUsedCaseLaws,
} from "./reports/actions";
import { DataTable } from "@/components/table/DataTable";
import { columns, userColumns } from "@/components/table/columns";
import {
  UploadsPerWeekChart,
  ChatActivityChart,
} from "@/components/charts/Charts";
import StatCard from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SignOutButton from "@/components/admin/SignOutButton";
import Link from "next/link";

export default async function AdminPage() {
  const stats = await getAdminStats();
  const users = await getAllUsers();
  const cases = await getMostUsedCaseLaws(5);
  const recentUploads = await getRecentUploads();
  const uploadStats = await getUploadChatReports();
  const chatActivity = await getChatActivityOverTime();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <div className="flex flex-row justify-center items-center gap-2">
          <Image
            src="/assets/icons/intelaw-logo.png"
            width={40}
            height={40}
            alt="Logo"
            className="h-8 w-fit"
          />
          <h1 className="text-xl font-bold">Welcome, Admin</h1>
        </div>
        <SignOutButton />
      </header>

      <main className="admin-main">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-transparent/20">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="uploads">Document Upload Reports</TabsTrigger>
            <TabsTrigger value="chat">Chat Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <section className="admin-stat">
              <StatCard
                type="users"
                count={stats.userCount}
                label="Users"
                icon={"/assets/icons/users.svg"}
              />
              <StatCard
                type="chats"
                count={stats.chatCount}
                label="Chats"
                icon={"/assets/icons/bot.svg"}
              />
              <StatCard
                type="messages"
                count={stats.messageCount}
                label="Messages"
                icon={"/assets/icons/message-square.svg"}
              />
              <StatCard
                type="documents"
                count={stats.documentCount}
                label="Documents"
                icon={"/assets/icons/files.svg"}
              />
            </section>

            <Card className="bg-dark-400 border-none text-[#fff]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Most Used Case Laws
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {cases.map((caseLaw: any) => (
                    <AccordionItem value={caseLaw.id} key={caseLaw.id}>
                      <AccordionTrigger className="text-base">
                        {caseLaw.metadata?.citation.replace(/\s*copy\s*$/i, "")}
                      </AccordionTrigger>
                      <AccordionContent className="grid grid-cols-1 gap-2 ">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[200px,1fr]">
                          {caseLaw.metadata?.court && (
                            <div className="text-sm sm:text-base">
                              <strong>Court: </strong>
                              <span>{caseLaw.metadata.court}</span>
                            </div>
                          )}
                          {caseLaw.metadata?.court_station && (
                            <div className="text-sm sm:text-base">
                              <strong>Court Station: </strong>
                              <span>{caseLaw.metadata.court_station}</span>
                            </div>
                          )}
                          {caseLaw.metadata?.type && (
                            <div className="text-sm sm:text-base">
                              <strong>Case Type: </strong>
                              <span>{caseLaw.metadata.type}</span>
                            </div>
                          )}
                          {caseLaw.metadata?.case_number && (
                            <div className="text-sm sm:text-base">
                              <strong>Case Number: </strong>
                              <span>{caseLaw.metadata.case_number}</span>
                            </div>
                          )}
                          {caseLaw.metadata?.judges && (
                            <div className="text-sm sm:text-base">
                              <strong>Judges: </strong>
                              <span>{caseLaw.metadata.judges}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-sm sm:text-base mt-2">
                          <strong>Chat Count: </strong>
                          <span>{caseLaw.chat_count}</span>
                        </div>

                        <Link
                          href={caseLaw.url}
                          target="_blank"
                          className="text-base text-blue-400 font-medium underline"
                        >
                          View Full Case
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="flex flex-col overflow-x-auto">
              <DataTable
                columns={userColumns}
                data={users}
                searchPlaceholder="Search for a user"
              />
            </div>
          </TabsContent>

          <TabsContent value="uploads">
            <div className="flex flex-col overflow-x-auto">
              <UploadsPerWeekChart data={uploadStats?.uploadsPerWeek ?? []} />
              <DataTable
                columns={columns}
                data={recentUploads}
                searchPlaceholder="Search document uploads"
              />
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="space-y-4">
              <ChatActivityChart
                data={(chatActivity?.rows ?? []).map((row) => ({
                  month: String((row as any).month ?? ""),
                  type: String((row as any).type ?? ""),
                  count: Number((row as any).count ?? 0),
                }))}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
