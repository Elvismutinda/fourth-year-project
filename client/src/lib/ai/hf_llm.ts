/**
 * Calls the LLM to generate responses.
 * @param query - The user's query.
 * @param context - (Optional) Extra context to guide the response.
 * @returns The AI's response.
 */
export async function chat_llm(
  query: string,
  context?: string
): Promise<string> {
  const SYSTEM_PROMPT = `
  You are Intelaw, an advanced AI legal research assistant, specifically tailored to assist legal practitioners. Your expertise lies in conducting thorough legal research and providing insightful legal analysis.

  Context: ${context}

  Your task is to accurately and comprehensively address the user legal query, prioritizing the use of the provided context only if it enhances the response. For identity or informational queries, respond without utilizing the context.\n.

  Maintain a formal, professional tone. Reference case law and constitutional provisions if relevant.
  `;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: query },
  ];

  const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    console.error("Error fetching from local LLM server:", response.statusText);
  }

  const data = await response.json();
  return data.response ?? "I'm sorry, but I couldn't generate a response.";
}
