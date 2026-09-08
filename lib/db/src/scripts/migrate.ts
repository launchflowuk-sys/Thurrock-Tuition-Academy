// Applies the SQL migrations that Drizzle does not own.
//
// Right now that is just the connect-pg-simple session table: it is excluded
// from `drizzle-kit push` via tablesFilter in drizzle.config.ts, and
// createTableIfMissing is off because connect-pg-simple reads its schema from
// an on-disk table.sql that esbuild does not bundle. Without this step, login
// fails on a fresh database with "relation user_sessions does not exist".
//
// Idempotent — every statement is IF NOT EXISTS guarded. Run it before the
// server starts on any new environment:
//   pnpm --filter @workspace/db run migrate
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../index";

const here = path.dirname(fileURLToPath(import.meta.url));
const SQL_DIR = path.resolve(here, "..", "..", "sql");

const MIGRATIONS = ["create-session-table.sql"];

async function main(): Promise<void> {
  for (const file of MIGRATIONS) {
    const sql = await readFile(path.join(SQL_DIR, file), "utf-8");
    process.stdout.write(`Applying ${file}... `);
    await pool.query(sql);
    process.stdout.write("ok\n");
  }
  console.log(`Done — ${MIGRATIONS.length} migration(s) applied.`);
}

main()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error("Migration failed:", err);
    await pool.end().catch(() => {});
    process.exit(1);
  });
