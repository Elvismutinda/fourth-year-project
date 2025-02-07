import { openai } from "@ai-sdk/openai";
import { customProvider } from "ai";

export const myProvider = customProvider({
  languageModels: {
    "title-model": openai("gpt-4o-mini"),
    "chat-model": openai("gpt-4o-mini"),
  },
});
