"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UIMessage } from "ai";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import { toast } from "sonner";

const Chat = ({ chatId }: { chatId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Array<UIMessage>>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { messages, setMessages, input, setInput, handleSubmit, status, stop } =
    useChat({
      api: "/api/chat",
      body: {
        chatId,
      },
      initialMessages: data || [],
      onError: (err) => {
        console.error("Error in chat", err);
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
      <div className="flex sticky top-0 py-1.5 items-center px-2">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <Messages messages={messages} status={status} />

      <form
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      >
        <ChatInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          setMessages={setMessages}
        />
      </form>
    </div>
  );
};

export default Chat;
