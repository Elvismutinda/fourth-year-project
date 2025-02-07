CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"file_url" text NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "file_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "file_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" DROP COLUMN "title";