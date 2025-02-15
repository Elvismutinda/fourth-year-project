import { sql } from "drizzle-orm";
import { db } from "./db";
import { generateEmbedding } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileUrl: string
) {
  try {
    const embeddingsVectors = `[${embeddings.join(", ")}]`;

    const queryResult = await db.execute(
      sql`
        SELECT content, 1 - (embedding <=> ${embeddingsVectors}::vector) AS similarity
        FROM documents
        WHERE file_url = ${fileUrl}
        ORDER BY similarity
        LIMIT 5;
      `
    );

    console.log("Query embeddings:", embeddings);

    return queryResult.rows.map((row) => ({
      text: row.content,
      score: row.similarity,
    }));
  } catch (error) {
    console.error("Error querying embeddings from NeonDB:", error);
    throw error;
  }
}

export async function getContext(query: string, fileUrl: string) {
  const queryEmbeddings = await generateEmbedding(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileUrl);

  // Filter results with score > 0.7
  const qualifyingDocs = matches.filter(
    (match) => typeof match.score === "number" && match.score > 0.7
  );

  let docs = qualifyingDocs.map((match) => match.text);

  return docs.join("\n").substring(0, 3000);
}
