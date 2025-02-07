import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateEmbedding(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " "),
    });

    const result = await response.json();

    // Log the response from OpenAI
    if (!result || !result.data || !result.data[0]) {
      console.error("Invalid response from OpenAI embeddings API: ", result);
      throw new Error("Invalid response from OpenAI embeddings API");
    }

    return result.data[0].embedding as number[];
  } catch (error) {
    console.error("Error calling OpenAI embeddings API: ", error);
    throw error;
  }
}
