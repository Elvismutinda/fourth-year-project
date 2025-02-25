import { HfInference } from "@huggingface/inference";
import { getContext } from "@/lib/context";

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  throw new Error("Missing Hugging Face API token.");
}

const hf = new HfInference(HUGGINGFACE_API_TOKEN);

export async function rag(query: string, fileUrl: string): Promise<string> {
  try {
    const context = await getContext(query, fileUrl);

    const prompt = `
      You are a highly formal AI legal assistant, designed to provide clear, concise, and professional responses to legal inquiries.
      Your primary role is to assist users with legal research by retrieving relevant case law and statutory provisions from the provided context.
      Speak in a calm, precise, and authoritative manner, maintaining legal professionalism.
      
      Context:
      ${context}

      User Question:
      ${query}

      If the context does not contain the answer, respond with: "I'm sorry, but I cannot provide an answer based on the available information."
      Avoid making assumptions or providing speculative answers.
    `;

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct", // Change this if using another LLM
      inputs: prompt,
      parameters: { max_new_tokens: 1000 },
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error("Error in RAG AI:", error);
    throw new Error("Failed to generate RAG response.");
  }
}
