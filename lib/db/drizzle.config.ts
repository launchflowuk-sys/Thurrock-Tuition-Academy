import { defineConfig } from "drizzle-kit";
import path from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // user_sessions is created by a one-off manual SQL migration and owned by
  // connect-pg-simple, not Drizzle (see lib/db/sql/create-session-table.sql).
  // Excluding it here stops `push` from proposing to drop it every run.
  tablesFilter: ["!user_sessions"],
});
