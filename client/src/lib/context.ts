import { sql } from "drizzle-orm";
import { db } from "./db";
import { generateEmbedding } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileUrl: string
) {
  try {
    const queryResult = await db.execute(
      sql`
        SELECT content
        FROM documents
        WHERE file_url = ${fileUrl}
        ORDER BY embedding <=> ${embeddings}
        LIMIT 5;
        `
    );

    return queryResult.rows.map((row) => row.content);
  } catch (error) {
    console.error("Error getting matches from embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileUrl: string) {
  const queryEmbeddings = await generateEmbedding(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileUrl);

  return matches.join("\n").substring(0, 3000);
}
