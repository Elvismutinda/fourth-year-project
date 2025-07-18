import { sql } from "drizzle-orm";
import { db } from "./db";
import { generateEmbedding } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileUrl: string
) {
  try {
    const vectorLiteral = sql.raw(`'[${embeddings.join(", ")}]'::vector`);

    const queryResult = await db.execute(
      sql`
        SELECT content, 1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
        FROM documents
        WHERE file_url = ${fileUrl}
        ORDER BY similarity DESC
        LIMIT 5;
      `
    );

    console.log("Query embeddings:", embeddings);
    console.log("Query fileUrl:", fileUrl);
    console.log("Query result:", queryResult);

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
    (match) => typeof match.score === "number" && match.score > 0.2
  );

  let docs = qualifyingDocs.map((match) => match.text);

  console.log("Qualifying docs:", docs);

  return docs.join("\n").substring(0, 3000);
}

export async function getCaseContext(query: string, caseLawId: string) {
  try {
    const queryEmbeddings = await generateEmbedding(query);
    const vectorLiteral = sql.raw(`'[${queryEmbeddings.join(", ")}]'::vector`);

    const queryResult = await db.execute(
      sql`
        SELECT content, 1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
        FROM case_law_chunks
        WHERE case_law_id = ${caseLawId}
        ORDER BY similarity DESC
        LIMIT 5;
      `
    );

    console.log("Query result:", queryResult);

    const bestChunks = queryResult.rows
      .filter(
        (row) => typeof row.similarity === "number" && row.similarity > 0.2
      )
      .map((row) => row.content);

    return bestChunks.join("\n").substring(0, 3000);
  } catch (error) {
    console.error("Error getting case law context:", error);
    return "";
  }
}
