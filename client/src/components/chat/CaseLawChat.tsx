"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Messages } from "./Messages";
import { CaseLawChatInput } from "./CaseLawChatInput";
import { toast } from "sonner";

const CaseLawChat = ({ caseLawId }: { caseLawId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["case", caseLawId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/case-messages", {
        caseLawId,
      });
      return response.data;
    },
  });

  const {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    append,
  } = useChat({
    api: "/api/caselaws",
    body: {
      caseLawId,
    },
    initialMessages: data || [],
    onError: () => {
      toast.error("An error occurred while sending the message.");
    },
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-w-0 h-full">
      <Messages messages={messages} status={status} />

      <form
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      >
        <CaseLawChatInput
          caseLawId={caseLawId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </form>
    </div>
  );
};

export default CaseLawChat;
