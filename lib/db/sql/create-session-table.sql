-- Session store table for connect-pg-simple (artifacts/api-server/src/lib/session.ts).
-- Not managed by Drizzle — connect-pg-simple owns this table's schema, and
-- createTableIfMissing is set to false because its on-disk table.sql asset
-- isn't bundled by esbuild (see .agents/memory/connect-pg-simple-esbuild.md).
-- Run this once by hand against any new database before starting the app.

CREATE TABLE "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_user_sessions_expire" ON "user_sessions" ("expire");
