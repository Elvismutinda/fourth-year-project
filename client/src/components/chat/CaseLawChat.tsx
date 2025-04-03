"use client";

import React from "react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import { Button } from "../ui/button";

type CaseLawChatProps = { chatId: string };

const examplePrompts = [
  "Summarize this case law.",
  "How does this case law differ from similar precedents?",
  "What practical implications does this ruling have for future cases?",
  "What was the key evidence that influenced the court's decision?",
  "What were the main arguments presented by both parties?",
  "Can you explain the court's reasoning for their final judgement?"
];

const CaseLawChat = ({ chatId }: CaseLawChatProps) => {
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

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
    handleSubmit();
  };

  return (
    <div className="flex flex-col min-w-0 h-full">
      <div className="">
      {messages.length === 0 && (
        <div className="lg:col-span-3 lg:mt-6">
          {/* <p className="mb-3 text-gray-600">Examples</p> */}
          <div className="grid gap-3 lg:grid-cols-3 lg:gap-5">
            {examplePrompts.map((prompt, index) => (
              <Button
                key={index}
                className="rounded-xl bg-gray-100 p-2.5 text-gray-600 sm:p-4"
                onClick={() => handleExampleClick(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}
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

export default CaseLawChat;
