CREATE TABLE "klr_docs" (
	"file_id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(384)
);
