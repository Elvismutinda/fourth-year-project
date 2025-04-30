ALTER TABLE "Chat" ADD COLUMN "caseLawId" uuid;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "type" varchar DEFAULT 'upload' NOT NULL;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_caseLawId_case_laws_id_fk" FOREIGN KEY ("caseLawId") REFERENCES "public"."case_laws"("id") ON DELETE no action ON UPDATE no action;