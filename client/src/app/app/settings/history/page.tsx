"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash, Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteChatHistory,
  exportChatHistory,
  importChatHistory,
} from "../actions";
import { toast } from "sonner";

const HistoryPage = () => {
  const [isPending, startTransition] = useTransition();

  const handleHistoryDelete = () => {
    const toastId = toast.loading("Deleting chat history...");

    startTransition(() => {
      deleteChatHistory().then((data) => {
        if (data?.error) {
          toast.error(data?.error, { id: toastId });
        } else {
          toast.success(data?.success, { id: toastId });
        }
      });
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      console.log("Imported file content:", text);

      const data = JSON.parse(text);
      console.log("Parsed data:", data);

      if (!data?.data || !Array.isArray(data.data)) {
        toast.error(
          "Please check the file format and try again. Note that this import is for Intelaw Chat exports, it will not work with files from other services like ChatGPT."
        );
        return;
      }

      const res = await importChatHistory(data);

      if (res?.error) {
        toast.error(res?.error);
      } else {
        toast.success(res?.success);
      }
    } catch (err) {
      toast.error("Import failed. Please upload a valid chat history JSON.");
      console.error(err);
    }
  };

  const handleExport = () => {
    exportChatHistory().then((data) => {
      if (data?.error) {
        toast.error(data?.error);
      } else {
        const dataStr = JSON.stringify(data);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;

        const currentDate = new Date().toISOString();
        a.download = `intelawchat-export-${currentDate}.json`;

        a.click();
        URL.revokeObjectURL(url);

        toast("Export completed successfully", {
          description: "Your chat data has been exported.",
        });
      }
    });
  };

  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-12">
      <section className="space-y-2">
        <h2 className="text-2xl">Message History</h2>
        <div className="space-y-6">
          <p className="text-muted/80">
            Save your history as JSON, or import someone else's. Importing will
            NOT delete existing messages
          </p>
          <div className="flex flex-row gap-2">
            <input
              type="file"
              id="import-json"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("import-json")?.click()}
              variant="main"
            >
              <Download />
              Import
            </Button>

            <Button onClick={handleExport} variant="main">
              <Upload />
              Export
            </Button>
          </div>
        </div>
      </section>

      <section className="-m-4 w-fit space-y-2 rounded-lg border border-muted-foreground/10 p-4 hover:bg-transparent/50">
        <h2 className="text-2xl font-bold">Danger Zone</h2>
        <div className="space-y-6">
          <p className="text-sm text-muted/80">
            Permanently delete your chat history from our servers and all
            associated messages.
          </p>
          <div className="flex flex-row gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-destructive-foreground shadow-sm h-9 px-4 py-2 border border-red-800/50 bg-red-800/50 hover:bg-red-800">
                  <Trash />
                  Delete Chat History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1A1928] border border-muted/20">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This will permanently delete all your chat history from our
                    servers. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent text-inherit hover:bg-transparent/30 hover:text-white-100 border-none">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isPending}
                    onClick={handleHistoryDelete}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-red-800 text-delete-foreground shadow-sm hover:bg-red-800/90 h-9 px-4 py-2"
                  >
                    Delete History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>

      <div className="space-y-6 rounded-lg bg-card p-4 md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Message Usage</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
