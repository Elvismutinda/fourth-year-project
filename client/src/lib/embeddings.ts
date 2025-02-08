import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";

const voyageEmbeddings = new VoyageEmbeddings({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function generateEmbedding(text: string) {
  try {
    const embeddings = await voyageEmbeddings.embedQuery(
      text.replace(/\n/g, " ")
    );

    return embeddings;
  } catch (error) {
    console.error("Error calling Voyage AI embeddings API: ", error);
    throw error;
  }
}
