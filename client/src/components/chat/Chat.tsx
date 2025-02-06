"use client";

import React from "react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Messages } from "./Messages";

type ChatProps = { chatId: number };

const Chat = ({ chatId }: ChatProps) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        chatId,
      },
      initialMessages: [],
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
    <div className="flex flex-col min-w-0 h-dvh bg-[#1A1928]">
      <div className="flex sticky top-0 py-1.5 bg-[#1A1928] items-center px-2">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <Messages messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="flex mx-auto px-4 bg-[#1A1928] pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask any question..."
          className="w-full"
        />
        <Button
          className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
          disabled={input.length === 0}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;
