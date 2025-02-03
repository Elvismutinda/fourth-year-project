CREATE TYPE "public"."userRole" AS ENUM('USER', 'PREMIUM');--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "role" "userRole" DEFAULT 'USER' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");