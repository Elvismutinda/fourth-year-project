import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
  throw new Error("Missing Hugging Face API token.");
}

console.log("HF_TOKEN loaded:", !!HF_TOKEN);

const hf = new HfInference(HF_TOKEN);

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const cleanedText = text.replace(/\n/g, " ").trim();
    if (!cleanedText) {
      throw new Error("Text is empty after cleaning, skipping embedding.");
    }

    console.log(
      "Sending text to Hugging Face for embedding:",
      cleanedText.slice(0, 200),
      "..."
    );

    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: cleanedText,
    });

    if (!Array.isArray(response)) {
      throw new Error("Hugging Face returned an invalid embedding response.");
    }

    console.log("Hugging Face embedding response:", response);
    if (
      Array.isArray(response) &&
      response.every((item) => typeof item === "number")
    ) {
      return response as number[];
    } else if (Array.isArray(response) && Array.isArray(response[0])) {
      return response[0] as number[];
    } else {
      throw new Error("Unexpected response format from Hugging Face API.");
    }
    // return result.data[0].embedding as number[];
  } catch (error) {
    console.error("Error calling Hugging Face embeddings API: ", error);
    throw error;
  }
}

// import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

// const voyageEmbeddings = new VoyageEmbeddings({
//   apiKey: process.env.VOYAGE_API_KEY,
// });

// export async function generateEmbedding(text: string) {
//   try {
//     const cleanedText = text.replace(/\n/g, " ").trim();
//     if (!cleanedText) {
//       throw new Error("Text is empty after cleaning, skipping embedding.");
//     }
//     console.log("Sending text to Voyage AI for embedding:", cleanedText.slice(0, 200), "...");

//     const embeddings = await voyageEmbeddings.embedQuery(cleanedText);
//     console.log("Voyage AI embedding response:", embeddings);

//     if (!embeddings || !Array.isArray(embeddings) || embeddings.length === 0) {
//       throw new Error("Voyage AI returned an empty or undefined embedding response.");
//     }

//     return embeddings;
//   } catch (error) {
//     console.error("Error calling Voyage AI embeddings API:", error);
//     throw error;
//   }
// }

// import { OpenAIApi, Configuration } from "openai-edge";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function generateEmbedding(text: string) {
//   try {
//     const response = await openai.createEmbedding({
//       model: "text-embedding-ada-002",
//       input: text.replace(/\n/g, " "),
//     });

//     console.log("Embedding response", response);

//     const result = await response.json();
//     return result.data[0].embedding as number[];
//   } catch (error) {
//     console.error("Error calling OpenAI embeddings API: ", error);
//     throw error;
//   }
// }
