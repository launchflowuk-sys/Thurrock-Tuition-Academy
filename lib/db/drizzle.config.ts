import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  // Relative to this config's directory, deliberately not an absolute path:
  // drizzle-kit globs this value, and on Windows an absolute path containing a
  // space (e.g. "...\CLAUDE WORK\...") fails to match, so `push` dies with
  // "No schema files found for path config".
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // user_sessions is created by a one-off manual SQL migration and owned by
  // connect-pg-simple, not Drizzle (see lib/db/sql/create-session-table.sql).
  // Excluding it here stops `push` from proposing to drop it every run.
  tablesFilter: ["!user_sessions"],
});
