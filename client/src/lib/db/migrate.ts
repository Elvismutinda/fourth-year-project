import { db } from "./node";
import { migrate } from "drizzle-orm/neon-http/migrator";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "src/lib/db/migrations",
    });

    console.log("Migrations completed");
  } catch (error) {
    console.error("Error running migrations: ", error);
    process.exit(1);
  }
};

main();
