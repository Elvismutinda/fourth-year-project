import { openai } from "@ai-sdk/openai";
import { customProvider } from "ai";

export const myProvider = customProvider({
  languageModels: {
    "title-model": openai("gpt-3.5-turbo"),
    "chat-model": openai("gpt-3.5-turbo"),
  },
});
