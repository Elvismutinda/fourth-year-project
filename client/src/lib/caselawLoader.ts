import { db } from "@/lib/db";
import { generateEmbedding } from "./embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import md5 from "md5";
import { case_law_chunks } from "./db/schema";

type CaseLaw = {
  id: string;
  content: string;
};

export async function loadCaseLawToNeon(caseLaw: CaseLaw) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 384,
    chunkOverlap: 50,
    separators: [". ", "\n", " ", ""],
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: caseLaw.content,
      metadata: { caseLawId: caseLaw.id },
    }),
  ]);

  const embeddedChunks = await Promise.all(
    docs.map(async (doc) => {
      const embedding = await generateEmbedding(doc.pageContent);
      const hash = md5(doc.pageContent);

      return {
        id: hash,
        caseLawId: caseLaw.id,
        content: doc.pageContent,
        embedding,
      };
    })
  );

  if (embeddedChunks.length > 0) {
    await db.insert(case_law_chunks).values(embeddedChunks);
  } else {
    console.warn("No chunks generated for caseLaw:", caseLaw.id);
  }
}
