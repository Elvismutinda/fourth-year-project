import { db } from "@/lib/db";
import { case_laws } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getCaseLaws(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`/api/caselaws?${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch case laws");
  }

  return res.json();
}

export const getCaseLawById = async (id: string) => {
  try {
    const caseLaw = await db
      .select()
      .from(case_laws)
      .where(eq(case_laws.id, id))
      .limit(1);
    return caseLaw.length ? caseLaw[0] : null;
  } catch (error) {
    console.error("Error fetching case law:", error);
    return null;
  }
};

export const getSimilarCases = async (caseId: string) => {
  try {
    // Fetch the embedding for the given case
    const caseEmbedding = await db
      .select({ embedding: case_laws.embedding })
      .from(case_laws)
      .where(sql`${case_laws.id} = ${caseId}`)
      .limit(1);

    if (!caseEmbedding.length || !caseEmbedding[0].embedding) {
      return [];
    }

    // Ensure the embedding is explicitly cast to vector
    const embeddingVector = caseEmbedding[0].embedding as number[];
    const embeddingArrayString = `'[${embeddingVector.join(",")}]'::vector`;

    const SIMILARITY_THRESHOLD = 0.8;

    // Find top 5 most similar cases
    const similarCases = await db.execute(sql`
      SELECT id, metadata, file_url, url, 
        (embedding <=> ${sql.raw(embeddingArrayString)}) AS distance
      FROM case_laws
      WHERE id != ${caseId}
      AND (embedding <=> ${sql.raw(
        embeddingArrayString
      )}) <= ${SIMILARITY_THRESHOLD}
      ORDER BY distance
      LIMIT 5;
    `);

    return similarCases.rows;
  } catch (error) {
    console.error("Error fetching similar cases:", error);
    return [];
  }
};
