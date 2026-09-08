-- Session store table for connect-pg-simple (artifacts/api-server/src/lib/session.ts).
-- Not managed by Drizzle — connect-pg-simple owns this table's schema, and
-- createTableIfMissing is set to false because its on-disk table.sql asset
-- isn't bundled by esbuild (see .agents/memory/connect-pg-simple-esbuild.md).
--
-- Applied by `pnpm --filter @workspace/db run migrate`. Every statement is
-- IF NOT EXISTS guarded, so re-running against an existing database is a no-op.
-- The primary key is declared inline rather than via ALTER TABLE because
-- Postgres has no ADD CONSTRAINT IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default"
    CONSTRAINT "session_pkey" PRIMARY KEY NOT DEFERRABLE INITIALLY IMMEDIATE,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_user_sessions_expire" ON "user_sessions" ("expire");
