CREATE TABLE "case_laws" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text,
	"file_url" text,
	"metadata" jsonb,
	"issues" text,
	"legal_principles" text,
	"ratio_decidendi" text,
	"reasoning" text,
	"content" text NOT NULL,
	"embedding" vector(384)
);
--> statement-breakpoint
DROP TABLE "test_cases" CASCADE;