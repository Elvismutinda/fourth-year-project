import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Message } from "ai/react";
import React from "react";
import { ThinkingMessage } from "./ThinkingMessage";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Markdown } from "./Markdown";

type MessagesProps = {
  messages: Message[];
  isLoading: boolean;
};

export const Messages = ({ messages, isLoading }: MessagesProps) => {
  const [messageContainerRef, messageEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messageContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message, index) => (
        <AnimatePresence key={message.id ?? index}>
          <motion.div
            className="w-full mx-auto max-w-3xl px-4 group/message"
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            data-role={message.role}
          >
            <div className="flex gap-2 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit">
              {message.role === "assistant" && (
                <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
                  <div className="translate-y-px">
                    <Sparkles size={14} />
                  </div>
                </div>
              )}

              {message.content && (
                <div className="flex flex-row gap-2 items-start">
                  <div
                    className={cn("flex flex-col gap-4", {
                      "bg-accent text-accent-foreground px-3 py-2 rounded-xl":
                        message.role === "user",
                    })}
                  >
                    <Markdown>{message.content as string}</Markdown>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div ref={messageEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  );
};
