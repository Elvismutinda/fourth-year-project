import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
// this seems to not work on edge runtime, so uncomment when migrating
// import { config } from "dotenv";

// config({ path: ".env.local" });

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not set");
// }

const sql = neon(process.env.DATABASE_URL!);

// logger
//const db = drizzle(sql, { logger: true })
const db = drizzle(sql);

export { db };
