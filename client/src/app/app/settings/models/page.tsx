"use client";

import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Brain, FileText } from "lucide-react";

const ModelPage = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => setShowMore((prev) => !prev);
  return (
    <TooltipProvider delayDuration={100}>
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8">
        <div className="flex h-full flex-col space-y-6">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Available Models</h2>
            <p className="mt-2 text-sm text-muted/80 sm:text-base">
              Choose your preferred model from the model selector. This won&apos;t
              affect existing conversations.
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full space-y-4 overflow-y-auto sm:h-[65vh] sm:min-h-[670px]">
              <div className="relative flex flex-col rounded-lg border border-input/40 p-3 sm:p-4">
                <div className="flex w-full items-start gap-4">
                  <div className="relative h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
                    <Image
                      src="/assets/icons/intelaw-logo.png"
                      alt="logo"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1">
                        <h3 className="font-medium">
                          Intelaw KenyaInstruct 1.0
                        </h3>
                        <span className="text-xs">(Default)</span>
                      </div>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="relative">
                      <p className="mr-12 text-xs sm:text-sm">
                        Intelaw&apos;s INSTRUCT model is our latest flagship
                        Kenyan model, trained using a novel RLHF method that
                        delivers top performance on various legal benchmarks.
                        This advanced state-of-the-art model is built upon a
                        comprehensive corpus of Kenyan legal datasets, ensuring
                        relevance and accuracy for legal professionals.
                        {showMore && (
                          <>
                            {" "}
                            It leverages transformer architecture with domain-
                            optimized fine-tuning, enabling nuanced legal
                            reasoning, contextual understanding, and precedent
                            alignment. Ideal for legal research, drafting, and
                            case analysis.
                          </>
                        )}
                      </p>
                      <button onClick={toggleShowMore} className="mt-1 text-xs">
                        {showMore ? "Show less" : "Show more"}
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-1 sm:mt-2 sm:gap-2">
                      <div className="flex flex-wrap gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative flex items-center gap-1 overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] text-[hsl(168_54%_74%)] sm:gap-1.5 sm:px-2 sm:text-xs">
                              <div className="absolute inset-0 bg-current opacity-15"></div>
                              <Brain className="h-2.5 w-2.5 brightness-75 sm:h-3 sm:w-3 filter-none" />
                              <span className="whitespace-nowrap brightness-75 filter-none">
                                Reasoning
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent align="center">
                            Has reasoning capabilities
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative flex items-center gap-1 overflow-hidden rounded-full px-1.5 py-0.5 text-[10px] text-[hsl(237_75%_77%)] sm:gap-1.5 sm:px-2 sm:text-xs">
                              <div className="absolute inset-0 bg-current opacity-15"></div>
                              <FileText className="h-2.5 w-2.5 brightness-75 sm:h-3 sm:w-3 filter-none" />
                              <span className="whitespace-nowrap brightness-75 filter-none">
                                PDFs
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent align="center">
                            Supports PDF uploads and analysis
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ModelPage;
