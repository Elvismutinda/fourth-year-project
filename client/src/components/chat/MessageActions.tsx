import type { Message } from "ai";
import { useCopyToClipboard } from "usehooks-ts";

import { Copy, Download } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { memo } from "react";
import { toast } from "sonner";

import { saveAs } from "file-saver";
import { marked } from "marked";
import htmlToDocx from "html-to-docx";

export function PureMessageActions({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) {
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;

  const handleDownload = async () => {
    const markdownText = message.parts
      ?.filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (!markdownText) {
      toast.error("There's no text to download!");
      return;
    }

    const html = await Promise.resolve(marked.parse(markdownText));

    try {
        // Convert HTML to DOCX
        const docxBlob = await htmlToDocx(html, null, {
            table: {row: {cantSplit: true}},
            footer: true,
            pageNumber: true
        })

        const blob = new Blob([docxBlob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        saveAs(blob, `intelaw-message-${message.id}.docx`);
        toast.success("Word document downloaded!");
    } catch (error) {
        toast.error("Failed to convert Markdown to DOXC.");
        console.error("Error converting Markdown to DOCX:", error);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                const textFromParts = message.parts
                  ?.filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("\n")
                  .trim();

                if (!textFromParts) {
                  toast.error("There's no text to copy!");
                  return;
                }

                await copyToClipboard(textFromParts);
                toast.success("Copied to clipboard!");
              }}
            >
              <Copy />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy to Clipboard</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={handleDownload}
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download as Word Document</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  }
);
