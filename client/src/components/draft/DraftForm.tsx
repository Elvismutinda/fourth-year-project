"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormField as FieldType } from "@/config/documents";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Asterisk } from "lucide-react";
import { Markdown } from "../chat/Markdown";

import { marked } from "marked";
import htmlToDocx from "html-to-docx";
import { saveAs } from "file-saver";

type DraftFormProps = {
  fields: FieldType[];
  documentType: string;
};

const generateSchema = (fields: FieldType[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let base = z.string();
    if (field.required) base = base.min(1, `${field.label} is required`);

    shape[field.name] = base;
  });

  return z.object(shape);
};

export default function DraftForm({ fields, documentType }: DraftFormProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(
    null
  );

  const draftDocumentSchema = generateSchema(fields);
  type DraftFormValues = z.infer<typeof draftDocumentSchema>;

  const form = useForm<DraftFormValues>({
    resolver: zodResolver(draftDocumentSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {} as DraftFormValues),
  });

  const onSubmit = async (values: DraftFormValues) => {
    setGeneratedDocument(null);
    setIsLoading(true);
    setDialogOpen(true);
    try {
      // console.log("Document Type:", documentType);

      const response = await fetch("http://localhost:8000/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType,
          fieldDetails: values,
        }),
      });
      const data = await response.json();

      if (data.document) {
        toast.success("Document generated successfully!");
        console.log("Generated document:", data.document);
        setGeneratedDocument(data.document);
      } else {
        toast.error("Failed to generate document.");
        console.error("Error generating document:", data.error);
      }
      // Handle the generated document (e.g., display it, download it, etc.)
    } catch (error) {
      console.error("Error submitting draft data:", error);
      toast.error("Failed to generate document.");
      setDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedDocument) {
      toast.error("There's no document to download!");
      return;
    }

    try {
      const html = await Promise.resolve(marked.parse(generatedDocument));

      const docxBlob = await htmlToDocx(html, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });

      const blob = new Blob([docxBlob], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const fileName = `${documentType}.docx`;
      saveAs(blob, fileName);

      toast.success("Word document downloaded!");
    } catch (error) {
      console.error("Error generating DOCX:", error);
      toast.error("Failed to generate Word document.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: rhfField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger className="ml-1 cursor-pointer">
                              <Asterisk className="size-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent className="text-sm text-[#fff] bg-black p-2 rounded">
                              This field is required
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </FormLabel>
                    <FormControl>
                      {field.type === "textarea" ? (
                        <Textarea
                          {...rhfField}
                          placeholder={field.label}
                          required={field.required}
                          autoComplete="off"
                          className="h-32 bg-gray-600/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                        />
                      ) : field.type === "select" ? (
                        <Select
                          onValueChange={rhfField.onChange}
                          defaultValue={rhfField.value}
                        >
                          <SelectTrigger className="h-11 bg-gray-600/80 border-none rounded-xl text-[#fff] placeholder-slate-500">
                            <SelectValue
                              placeholder={`Select ${field.label}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...rhfField}
                          type={field.type}
                          required={field.required}
                          autoComplete="off"
                          className="h-11 bg-gray-600/80 border-none rounded-xl text-[#fff] placeholder-slate-500"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <Button variant="main" type="submit" className="h-10">
            Generate Document
          </Button>
        </form>
      </Form>

      {/* Modal for document generation */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl text-primary">
          <DialogHeader>
            <DialogTitle>
              Document Generation
              <p className="text-sm text-muted-foreground">
                <span className="underline font-bold">Note: </span>Once you
                leave this dialog the document cannot be retrieved again.
              </p>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isLoading ? "Please wait while we draft your document..." : null}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-auto whitespace-pre-wrap text-sm">
            {isLoading ? (
              <p className="animate-pulse">Generating...</p>
            ) : generatedDocument ? (
              <Markdown>{generatedDocument}</Markdown>
            ) : (
              <p className="text-red-500">Error: No document generated.</p>
            )}
          </div>

          <DialogFooter>
            {generatedDocument && (
              <Button variant="default" onClick={handleDownload}>
                Download as Word Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
