import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { case_laws } from "@/lib/db/schema";
import { eq, like } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const judge = searchParams.get("judge");
    const query = searchParams.get("query");
    const court = searchParams.get("court");
    const topic = searchParams.get("topic");

    let caseQuery = db
      .select({
        id: case_laws.id,
        url: case_laws.url,
        file_url: case_laws.file_url,
        metadata: case_laws.metadata,
      })
      .from(case_laws);

    if (judge) {
      caseQuery = caseQuery.where(eq(case_laws.metadata.judges, judge));
    }

    if (court) {
      caseQuery = caseQuery.where(eq(case_laws.metadata.court, court));
    }

    if (topic) {
      caseQuery = caseQuery.where(eq(case_laws.metadata.court_division, topic));
    }

    if (query) {
      caseQuery = caseQuery.where(
        like(case_laws.metadata.case_number, `%${query}%`)
      );
    }

    const cases = await caseQuery;
    return NextResponse.json(cases);
  } catch (error) {
    console.error("Error fetching case laws:", error);
    return NextResponse.json(
      { error: "Failed to fetch case laws" },
      { status: 500 }
    );
  }
}
