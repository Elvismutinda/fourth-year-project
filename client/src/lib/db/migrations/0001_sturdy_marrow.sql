ALTER TABLE "Chat" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "Chat" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "Message" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;