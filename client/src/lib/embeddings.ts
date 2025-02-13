import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

const voyageEmbeddings = new VoyageEmbeddings({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function generateEmbedding(text: string) {
  try {
    const cleanedText = text.replace(/\n/g, " ").trim();
    if (!cleanedText) {
      throw new Error("Text is empty after cleaning, skipping embedding.");
    }
    console.log("Sending text to Voyage AI for embedding:", cleanedText.slice(0, 200), "...");

    const embeddings = await voyageEmbeddings.embedQuery(cleanedText);
    console.log("Voyage AI embedding response:", embeddings);

    if (!embeddings || !Array.isArray(embeddings) || embeddings.length === 0) {
      throw new Error("Voyage AI returned an empty or undefined embedding response.");
    }

    return embeddings;
  } catch (error) {
    console.error("Error calling Voyage AI embeddings API:", error);
    throw error;
  }
}

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
