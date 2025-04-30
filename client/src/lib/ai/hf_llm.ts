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
export async function chat_llm(
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

  // const response = await hf.chatCompletion({
  //   model: "meta-llama/Llama-3.2-3B-Instruct",
  //   messages,
  //   max_tokens: 512,
  //   temperature: 0.7,
  // });

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

export async function draft_llm(
  documentType: string,
  fieldDetails?: Record<string, string>
): Promise<string> {
  console.log("Document Type in draft_llm:", documentType);
  console.log("Field Details in draft_llm:", fieldDetails);

  const fieldsString = fieldDetails
    ? Object.entries(fieldDetails)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "";

  const DRAFT_PROMPT = `
    You are a legal expert drafting a ${documentType} document template under Kenyan law.

    ### Field Details:
    ${fieldsString}

    If provided, use the details to generate a professional and legally accurate document.
  `;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: DRAFT_PROMPT },
  ];

  const response = await hf.chatCompletion({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  console.log("Response from Hugging Face:", JSON.stringify(response, null, 2));

  const document = response.choices[0]?.message?.content;
  if (!document) {
    console.error("Error: Failed to generate valid document.");
    return "I'm sorry, but I couldn't generate the document.";
  }

  return document;
}

export async function caselaw_llm(
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

  const response = await fetch("http://localhost:8000/caselaw", {
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
