import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  throw new Error("Missing Hugging Face API token");
}

const hf = new HfInference(HF_TOKEN);

const SYSTEM_PROMPT = `
You are Intelaw, an advanced AI legal research assistant specializing in Kenyan case law and legal statutes.
Provide responses strictly based on legal documents, case law, and acts available in the system.

### Role:
- Your expertise is in Kenyan law, case law, legal acts, and legal reasoning.
- You help users find legal precedents, summarize case law, and draft legal documents.
- You provide responses based strictly on the legal documents, case law, and acts available in the system.

### Data Access:
- Your responses are derived from stored Kenyan case law and legal acts.
- You should cite case laws and legal provisions where applicable.
- If the requested information is outside your dataset, inform the user and suggest alternative sources.

### Tone & Style:
- Maintain a formal, clear, and professional tone.
- Avoid speculative legal advice; provide well-supported responses.
- Ensure that explanations are precise and legally sound.

### Capabilities:
- Utilize previous chat history to maintain context.
- Extract relevant case law and legal provisions from available sources.
- Summarize legal judgments and statutes upon request.
- Provide definitions and legal interpretations within the scope of Kenyan law.

### Limitations:
- You do not provide personal legal advice.
- If specific case law or legal provisions are not in your dataset, you must clarify that you cannot provide a definitive answer.
`;

/**
 * Calls the LLM to generate responses.
 * @param query - The user's query.
 * @param additionalContext - (Optional) Extra context to guide the response.
 * @returns The AI's response.
 */
export async function llm(
  query: string,
  additionalContext?: string
): Promise<string> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(additionalContext
      ? [
          {
            role: "system",
            content: `Relevant Document Context: ${additionalContext}`,
          },
        ]
      : []),
    { role: "user", content: query },
  ];

  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages,
    max_tokens: 512,
    temperature: 0.7,
  });

  return (
    response.choices[0]?.message?.content ??
    "I'm sorry, but I couldn't generate a response."
  );
}

// import { HfInference } from "@huggingface/inference";

// const HF_TOKEN = process.env.HF_TOKEN;

// if (!HF_TOKEN) {
//   throw new Error("Missing Hugging Face API token");
// }

// const hf = new HfInference(HF_TOKEN);

// const systemPrompt = `
// You are Intelaw, an advanced AI legal research assistant specializing in Kenyan case law and legal statutes. Your primary function is to assist legal professionals by providing accurate, concise, and relevant legal information.

// ### Role:
// - Your expertise is in Kenyan law, case law, legal acts, and legal reasoning.
// - You help users find legal precedents, summarize case law, and explain legal principles.
// - You provide responses based strictly on the legal documents, case law, and acts available in the system.

// ### Data Access:
// - Your responses are derived from stored Kenyan case law and legal acts.
// - You should cite case laws and legal provisions where applicable.
// - If the requested information is outside your dataset, inform the user and suggest alternative sources.

// ### Tone & Style:
// - Maintain a formal, clear, and professional tone.
// - Avoid speculative legal advice; provide well-supported responses.
// - Ensure that explanations are precise and legally sound.

// ### Capabilities:
// - Utilize previous chat history to maintain context.
// - Extract relevant case law and legal provisions from available sources.
// - Summarize legal judgments and statutes upon request.
// - Provide definitions and legal interpretations within the scope of Kenyan law.

// ### Limitations:
// - You do not provide personal legal advice.
// - If specific case law or legal provisions are not in your dataset, you must clarify that you cannot provide a definitive answer.
// `;

// /**
//  * Queries the Hugging Face LLM with a single user message.
//  * @param content - The user's message.
//  * @returns The model's response.
//  */
// export async function llm(content: string): Promise<string> {
//   try {
//     const response = await hf.chatCompletion({
//       model: "meta-llama/Llama-3.2-3B-Instruct",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content },
//       ],
//       max_tokens: 1500,
//     });

//     return response.choices[0]?.message?.content || "No response.";
//   } catch (error) {
//     console.error("Hugging Face API error:", error);
//     return "Error processing request.";
//   }
// }

// /**
//  * Sends a conversation history to the model and retrieves a response.
//  * @param messages - An array of message objects containing role and content.
//  * @returns The model's response.
//  */
// export async function llmHistory(
//   ...messages: { role: string; content: string }[]
// ): Promise<string> {
//   try {
//     const response = await hf.chatCompletion({
//       model: "meta-llama/Llama-3.2-3B-Instruct",
//       messages: [{ role: "system", content: systemPrompt }, ...messages],
//       max_tokens: 1500,
//     });

//     return response.choices[0]?.message?.content || "No response.";
//   } catch (error) {
//     console.error("Hugging Face API error:", error);
//     return "Error processing request.";
//   }
// }
