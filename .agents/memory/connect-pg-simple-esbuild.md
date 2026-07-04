---
name: connect-pg-simple createTableIfMissing fails under esbuild bundling
description: express-session + connect-pg-simple session store errors at runtime (ENOENT table.sql) when the server is bundled with esbuild
---

`connect-pg-simple`'s `createTableIfMissing: true` option reads a `table.sql` file from its own package directory at runtime. esbuild bundles only JS into `dist/`, so that file isn't present in the built output — the option throws `ENOENT: no such file or directory, open '.../dist/table.sql'` in production/bundled runs (works fine in unbundled dev/ts-node).

**Why:** discovered while adding custom email/password auth (replacing Clerk) — signup succeeded (201) but the session cookie never worked because the store silently failed to ensure the table, breaking the entire login flow.

**How to apply:** when using `connect-pg-simple` in an esbuild-bundled Express server, create the session table once via a manual SQL migration (standard schema: `sid varchar PK, sess json, expire timestamp` + expire index) and set `createTableIfMissing: false`. Don't rely on the package's on-disk asset in bundled builds.
