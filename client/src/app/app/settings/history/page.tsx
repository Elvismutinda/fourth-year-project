import React from "react";
import { Button } from "@/components/ui/button";
import { Share, Trash } from "lucide-react";

const HistoryPage = () => {
  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-12">
      <section className="space-y-2">
        <h2 className="text-2xl">Message History</h2>
        <div className="space-y-6">
          <p className="text-muted-foreground/80">Save your history as JSON.</p>
          <div className="flex flex-row gap-2">
            <Button variant='main'>
              <Share />
              Export
            </Button>
          </div>
        </div>
      </section>

      <section className="-m-4 w-fit space-y-2 rounded-lg border border-muted-foreground/10 p-4 hover:bg-red-800/20">
        <h2 className="text-2xl font-bold">Danger Zone</h2>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground/80">
            Permanently delete your chat history from our servers and all
            associated messages.
          </p>
          <div className="flex flex-row gap-2">
            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-destructive-foreground shadow-sm h-9 px-4 py-2 border border-red-800/20 bg-red-800/20 hover:bg-red-800">
              <Trash />
              Delete Chat History
            </Button>
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
