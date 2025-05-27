import { downloadFromCloudinary } from "./cloudinary-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { generateEmbedding } from "./embeddings";
import { db } from "@/lib/db";
import { documents } from "./db/schema";
import fs from "fs";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

/**
 * Load a Cloudinary PDF into NeonDB
 */
export async function loadCloudinaryToNeon(fileUrl: string, userId: string) {
  try {
    // 1. Download PDF from Cloudinary and read it into memory
    console.log("Downloading from Cloudinary...");

    const file_name = await downloadFromCloudinary(fileUrl);
    if (!file_name) {
      throw new Error("Could not download from Cloudinary");
    }

    console.log("Loading PDF into memory: " + file_name);
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];

    if (!pages || pages.length === 0) {
      throw new Error("PDF contains no pages");
    }

    // 2. Split and segment the PDF
    console.log("Splitting and processing document...");
    const allDocuments = await Promise.all(pages.map(prepareDocument));
    const flattenedDocs = allDocuments.flat();

    // 3. Vectorize and embed individual documents
    console.log("Embedding document...");
    const vectors = await Promise.all(flattenedDocs.map(embedDocument));
    const validVectors = vectors.filter((v) => v !== null);

    // 4. Upload to NeonDB
    console.log("Storing embeddings in NeonDB...");
    await storeEmbeddingsInNeon(validVectors, fileUrl, userId);

    // 5. Clean up temp file
    fs.unlinkSync(file_name);
    console.log("Temp file deleted", file_name);

    return flattenedDocs[0];
  } catch (error) {
    console.error("Error processing PDF: ", error);
    throw error;
  }
}

/**
 * Convert document text into an embedding
 */
async function embedDocument(doc: Document) {
  try {
    if (!doc.pageContent) {
      throw new Error("Document has no content");
    }
    const embeddings = await generateEmbedding(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.pageContent,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

/**
 * Store embeddings in NeonDB's pgvector table
 */
async function storeEmbeddingsInNeon(
  vectors: any[],
  fileKey: string,
  userId: string
) {
  for (const vector of vectors) {
    if (!vector) {
      continue;
    }

    await db.insert(documents).values({
      userId: userId,
      fileUrl: fileKey,
      content: vector.metadata.text,
      embedding: vector.values,
    });
  }
}

/**
 * Truncate text by bytes
 */
// export const truncateStringByBytes = (str: string, bytes: number) => {
//   const enc = new TextEncoder();
//   return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
// };

/**
 * Splits text into smaller chunks
 */
async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n\n+/g, "\n");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 384,
    chunkOverlap: 50,
    separators: [". ", "\n", " ", ""],
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: pageContent,
      },
    }),
  ]);
  return docs;
}
