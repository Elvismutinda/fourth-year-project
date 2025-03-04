"use client";

import React from "react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";

type ChatProps = { chatId: string };

const Chat = ({ chatId }: ChatProps) => {
  const { data, isPending } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
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
    isLoading,
    stop,
  } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
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

      <Messages messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      >
        <ChatInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          // handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          setMessages={setMessages}
        />
      </form>
    </div>
  );
};

export default Chat;
