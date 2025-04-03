CREATE TABLE "test_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"metadata" jsonb,
	"content" text NOT NULL,
	"embedding" vector(384),
	CONSTRAINT "test_cases_url_unique" UNIQUE("url")
);
