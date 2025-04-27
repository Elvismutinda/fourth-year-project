import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "../ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { toast } from "sonner";
import { useResizeDetector } from "react-resize-detector";

interface PdfFullscreenProps {
  fileUrl: string;
}

const PDFFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setIsOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full max-h-[95vh] overflow-hidden text-[#2c3854] flex flex-col">
        <VisuallyHidden>
          <DialogTitle>PDF Viewer</DialogTitle>
        </VisuallyHidden>
        <SimpleBar
          autoHide={false}
          className="flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(95vh - 4rem)" }}
        >
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast.error("Error loading PDF. Try again later");
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={fileUrl}
              className="w-full"
            >
              {Array.from(new Array(numPages), (_, i) => (
                <Page
                  key={`page_${i + 1}`}
                  pageNumber={i + 1}
                  width={width ?? 800}
                  className="mb-4"
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PDFFullscreen;
