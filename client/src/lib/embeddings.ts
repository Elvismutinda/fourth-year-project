import axios from "axios";

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const cleanedText = text.replace(/\n/g, " ").trim();
    if (!cleanedText) {
      throw new Error("Text is empty after cleaning, skipping embedding.");
    }

    // console.log(
    //   "Sending text to Hugging Face for embedding:",
    //   cleanedText.slice(0, 200),
    //   "..."
    // );

    const response = await axios.post("http://localhost:8000/embed", {
      text: cleanedText,
    });

    // console.log("Embedding response:", response.data);

    const embedding = response.data.embedding;
    if (!Array.isArray(embedding)) {
      throw new Error("FastAPI returned an invalid embedding array.");
    }

    return embedding;
  } catch (error) {
    console.error("Error calling FastAPI embeddings API: ", error);
    throw error;
  }
}
