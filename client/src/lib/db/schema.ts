import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  varchar,
  timestamp,
  jsonb,
  uuid,
  text,
  uniqueIndex,
  vector,
  serial,
  index,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole", ["USER", "PREMIUM"]);

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  password: varchar("password", { length: 64 }).notNull(),
  role: userRole("role").notNull().default("USER"),
  phone: varchar("phone", { length: 15 }),
  paystackSubscriptionStart: timestamp("paystackSubscriptionStart"),
  paystackSubscriptionEnd: timestamp("paystackSubscriptionEnd"),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  caseLawId: uuid("caseLawId").references(() => case_laws.id),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  type: varchar("type", { enum: ["upload", "case_law"] }) // optional helper
    .notNull()
    .default("upload"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId").references(() => chat.id),
  caseLawId: uuid("caseLawId").references(() => case_laws.id),
  role: varchar("role").notNull(),
  content: text("content").notNull(),
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

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    fileUrl: text("file_url").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 384 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("documents_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const klr_docs = pgTable(
  "klr_docs",
  {
    file_id: text("file_id").primaryKey(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 384 }),
  },

  (table) => ({
    embeddingIndex: index("acts_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const case_laws = pgTable(
  "case_laws",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    url: text("url").unique(),
    file_url: text("file_url"),
    metadata: jsonb("metadata"),
    issues: jsonb("issues"),
    legal_principles: jsonb("legal_principles"),
    ratio_decidendi: text("ratio_decidendi"),
    reasoning: text("reasoning"),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 384 }),
    full_text: text("full_text"),
  },
  (table) => ({
    embeddingIndex: index("cases_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const case_law_chunks = pgTable("case_law_chunks", {
  id: text("id").primaryKey(),
  caseLawId: uuid("case_law_id").references(() => case_laws.id),
  content: text("content"),
  embedding: vector("embedding", { dimensions: 384 }),
});
