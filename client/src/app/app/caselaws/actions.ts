"use server";

import { db } from "@/lib/db";
import { case_laws } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

interface SearchFilters {
  query?: string;
  judge?: string;
  court?: string;
  topic?: string;
}

export async function getAllCaseLaws() {
  try {
    const cases = await db
      .select({
        id: case_laws.id,
        url: case_laws.url,
        file_url: case_laws.file_url,
        metadata: case_laws.metadata,
      })
      .from(case_laws);

    return cases;
  } catch (error) {
    console.error("Error fetching all case laws:", error);
    throw new Error("Failed to fetch all case laws");
  }
}

export async function searchCaseLaws(filters: SearchFilters = {}) {
  const { query, judge, court, topic } = filters;

  try {
    let whereConditions = [];

    if (judge) {
      whereConditions.push(sql`${case_laws.metadata} ->> 'judges' = ${judge}`);
    }

    if (court) {
      whereConditions.push(sql`${case_laws.metadata} ->> 'court' = ${court}`);
    }

    if (topic) {
      whereConditions.push(
        sql`${case_laws.metadata} ->> 'court_division' = ${topic}`
      );
    }

    if (query) {
      whereConditions.push(
        sql`(${case_laws.metadata} ->> 'case_number' ILIKE ${`%${query}%`} OR
              ${case_laws.metadata} ->> 'citation' ILIKE ${`%${query}%`} OR
              ${case_laws.metadata} ->> 'judges' ILIKE ${`%${query}%`} OR
              ${case_laws.metadata} ->> 'court' ILIKE ${`%${query}%`} )`
      );
    }

    const cases = db
      .select({
        id: case_laws.id,
        url: case_laws.url,
        file_url: case_laws.file_url,
        metadata: case_laws.metadata,
      })
      .from(case_laws)
      .where(whereConditions.length ? and(...whereConditions) : undefined);

    return cases;
  } catch (error) {
    console.error("Error fetching case laws:", error);
    throw new Error("Failed to fetch case laws");
  }
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
