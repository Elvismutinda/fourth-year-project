ALTER TABLE "documents" ALTER COLUMN "embedding" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "chatId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Message" ADD COLUMN "caseLawId" uuid;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_caseLawId_case_laws_id_fk" FOREIGN KEY ("caseLawId") REFERENCES "public"."case_laws"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cases_embedding_idx" ON "case_laws" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "documents_embedding_idx" ON "documents" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "acts_embedding_idx" ON "klr_docs" USING hnsw ("embedding" vector_cosine_ops);