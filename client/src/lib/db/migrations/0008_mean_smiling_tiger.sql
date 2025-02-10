ALTER TABLE "Chat" ALTER COLUMN "file_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "file_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "phone" varchar(15) NOT NULL;