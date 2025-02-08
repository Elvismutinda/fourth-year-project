import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  uniqueIndex,
  vector,
  serial,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole", ["USER", "PREMIUM"]);

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  password: varchar("password", { length: 64 }).notNull(),
  role: userRole("role").notNull().default("USER"),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const verificationToken = pgTable(
  "VerificationToken",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: varchar("email", { length: 64 }).notNull(),
    token: varchar("token", { length: 64 }).notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("emailTokenUnique").on(
      table.email,
      table.token
    ),
  })
);

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  fileUrl: text("file_url").notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1024 }),
});
