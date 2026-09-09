# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm-workspace monorepo for Thurrock Tuition Academy (TTA) — a tutoring business platform: public marketing site, an admin dashboard, and a parent portal. Deployed to Coolify/Hetzner from the root `Dockerfile`: one container builds the frontend and the API server, and the API server serves the built frontend as static files with an SPA fallback (`artifacts/api-server/src/app.ts`).

## Commands

Run from repo root unless noted.

- `pnpm --filter @workspace/api-server run dev` — run the API server (builds with esbuild, then starts on port 8080; proxied at `/api`)
- `pnpm --filter @workspace/thurrock-tuition run dev` — run the main frontend (Vite, port from `PORT` env, required)
- `pnpm run typecheck` — full typecheck: libs first (`tsc --build`), then all `artifacts/*` and `scripts`
- `pnpm run build` — typecheck, then build every package that has a `build` script
- `pnpm --filter <pkg> run typecheck` — typecheck a single package (e.g. `@workspace/api-server`)
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks (`lib/api-client-react`) and Zod schemas (`lib/api-zod`) from `openapi.yaml`, then re-typechecks libs
- `pnpm --filter @workspace/db run migrate` — apply the non-Drizzle SQL migrations (currently just the `user_sessions` session-store table). Idempotent; must be run against any new database before the app starts or login fails
- `pnpm --filter @workspace/db run push` — push Drizzle schema to Postgres (dev only); `push-force` variant exists for destructive changes
- `pnpm --filter @workspace/db run create-admin <email> <password> "<name>"` — create or promote an admin login (see below)
- `pnpm --filter @workspace/tta-marketing-deck run validate-slides` — validate the marketing deck's slide data

Required env: see `.env.example` — `DATABASE_URL`, `PORT`, `BASE_PATH`, `SESSION_SECRET`, `SETTINGS_ENCRYPTION_KEY` and `SQUARE_WEBHOOK_SIGNATURE_KEY` are all read at boot and the server throws on startup if any is missing. There is no test runner configured in this repo — verification is typecheck + manual/curl checks.

**Admin accounts are not created through the app.** `POST /api/auth/signup` always assigns `role: "parent"` (deliberately — see `routes/auth.ts`), and `/staff` manages a separate `staff` table, not login users. Use the `create-admin` script above to create the first admin or promote an existing account.

## Workspace layout

pnpm workspace packages live under `artifacts/*`, `lib/*`, `lib/integrations/*`, and `scripts` (see `pnpm-workspace.yaml`). Shared dependency versions are pinned in the `catalog:` block there — use `"catalog:"` as the version for anything already listed instead of hardcoding a version.

**`artifacts/`** — deployable apps:
- `api-server` — Express 5 backend, builds to a single esbuild CJS-ish bundle (`dist/index.mjs`)
- `thurrock-tuition` — the real product: public site + admin dashboard + parent portal (Vite/React)
- `mockup-sandbox` — isolated component/design preview sandbox (`kind = "design"`), not part of the shipped product
- `tta-marketing-deck` — a slides-based marketing/launch-plan deck, unrelated to the tutoring app itself

**`lib/`** — shared, non-deployable packages:
- `api-spec` — `openapi.yaml`, the single source of truth for every API contract, plus the Orval codegen config
- `api-client-react` — generated React Query hooks (`src/generated/`) + `custom-fetch.ts`, a hand-written fetch wrapper shared with non-web (e.g. Expo/React Native) consumers — supports a settable base URL and bearer-token getter for that case, but the web app relies on cookie sessions (`credentials: "include"`) instead
- `api-zod` — generated Zod schemas (`src/generated/`) used for request/response validation on both client and server
- `db` — Drizzle ORM schema (`src/schema/*.ts`, one file per resource) and the Postgres pool/`db` export

## Architecture

**Contract-first API flow**: edit `lib/api-spec/openapi.yaml` → run its `codegen` script → both `api-client-react` (hooks) and `api-zod` (schemas) regenerate. Never hand-edit files under any `src/generated/` directory — they're overwritten on next codegen.

**Auth is custom session-based, not Clerk.** The app was migrated off an earlier Clerk design to bcrypt + `express-session` + `connect-pg-simple`, with `req.session.userId`, `req.session.role`, `req.session.email`. Middleware lives in `artifacts/api-server/src/lib/authMiddleware.ts`:
- `requireAuth` — any signed-in user
- `requireAdmin` — signed-in and `role === "admin"`
- `ownsStudent(req, studentId)` — true for admins, or for the parent whose `parentEmail` matches the session email

`artifacts/api-server/src/middlewares/auth.ts` is a stale duplicate of the same two functions and is not wired into any route — don't add to it; use `lib/authMiddleware.ts`.

**Express has no global auth gate — routes are public unless a handler explicitly adds middleware.** This bit the project once already (see `.agents/memory/express-routes-default-public.md`): every handler in a route file must import and apply `requireAuth`/`requireAdmin`/`ownsStudent` itself. When adding a new route file, apply auth as the first step, before business logic. Use `requireAdmin` for admin-only resources (staff, settings, courses, sessions, dashboard, enquiries/intake management) and an ownership check for parent-facing resources (students, progress, tasks, payments, messages).

**Session store gotcha**: `connect-pg-simple`'s `createTableIfMissing: true` breaks under esbuild bundling (the package's `table.sql` asset isn't in `dist/`). The session table is created via manual migration instead, with `createTableIfMissing: false` — see `.agents/memory/connect-pg-simple-esbuild.md`.

**Routing (frontend)**: Wouter, all routes nested under `BASE_URL` (`artifacts/thurrock-tuition/src/App.tsx`). Public marketing pages (`/`, `/services`, `/about`, `/contact`, `/privacy`) are unauthenticated; `/dashboard`, `/students`, `/sessions`, `/progress`, `/tasks`, `/payments`, `/settings`, `/staff`, `/intake`, `/courses` are wrapped in `AdminRoute` (redirects non-admins to the parent portal); `/parent` is wrapped in `ParentRoute`. Auth state comes from `AuthProvider`/`useAuth` in `src/lib/auth-context`, driven by the session cookie, not a token.

**Secrets at rest**: every credential column in `settings` (SMTP password, Square, PayPal, Stripe) is encrypted with AES-256-GCM via `lib/encryption.ts` before being written, and decrypted on read through `readSecret` in `lib/paymentSettings.ts`. `ENCRYPTED_SETTINGS_FIELDS` is the canonical list — keep the `encrypt()` calls in `routes/settings.ts` and the migration script in sync with it. Values written before encryption existed are passed through untouched, so a partially-migrated database keeps working; `pnpm --filter @workspace/api-server run migrate:encrypt-settings` converts them.

**Email**: every outbound message is composed from `artifacts/api-server/src/lib/emailShell.ts` — one branded shell (navy `#142a46` / gold `#ffce32`, matching the *public site*, not the dashboard palette) plus `para`/`callout`/`detailTable`/`section` primitives. Three rules it exists to enforce: the header pairs the logo with a text wordmark so the brand survives blocked images; image URLs are absolute (a relative path resolves against the mail client); and subjects are built only by `subjectLine()`, which requires the **child's** name, so the parent's name cannot land where the student's belongs. `POST /intake` is public, so every interpolated value goes through `esc()`.

**Consent**: `src/lib/cookie-consent.ts` holds the decision (localStorage, not a cookie — recording a refusal must not set the thing being refused); undecided reads as refusal. Any future analytics must load from a `CONSENT_EVENT` listener guarded by `hasConsent()`, never at module top level, or it runs before a choice exists.

**Promoting an application**: `POST /intake/:id/convert` creates the `students` row. `intake_submissions.converted_student_id` is the idempotency guard — the claiming UPDATE is conditional on it still being NULL, so a double click gets a 409 instead of twin records.

**No mocked data** — everything is served from Postgres via Drizzle.

**Theme**: Navy (`#1B2B6B`) primary, Gold (`#C9973A`) secondary; Crimson Pro for serif headings, Inter for body — see `artifacts/thurrock-tuition/src/index.css`.

## Deploying

**Pushing `main` auto-deploys to the live business site**, `https://thurrocktuitionacademy.co.uk` (and `www`). Coolify project `imwzf2fxe5n0yztnqmg2ar3w`, app `l88052ek1plpw91p1achw6jy`, database `j4m1f7m1pitlbzm4i0vh56ix`. The same server hosts CABIO and two other clients, and the API token in `Credentials.txt` (gitignored) reaches all of them — scope every API call to the TTA uuids.

**Migrations run before the deploy, never after.** The app selects columns that must already exist, or the public homepage 500s. The database is not reachable from outside the server, so apply SQL through it:

```
Get-Content .\lib\db\sql\FILE.sql -Raw | ssh root@178.105.149.221 'docker exec -i $(docker ps -qf name=j4m1f7m1pitlbzm4i0vh56ix) psql -U postgres -d postgres -v ON_ERROR_STOP=1'
```

Then verify with `lib/db/sql/verify-migration.sql` (read-only; every row should read `ok`). Write migrations add-only and `IF NOT EXISTS`, so rolling the app back needs no database change.

Build traps already hit — don't repeat them:

- Coolify's health check runs `curl` **inside** the container. `node:24-slim` has neither curl nor wget, so a healthy container gets marked unhealthy and rolled back. `curl` is installed in the Dockerfile for this reason alone.
- `pnpm-lock.yaml` is at the repo root. Adding a dependency to any `artifacts/*/package.json` and committing only that directory fails the build with `ERR_PNPM_OUTDATED_LOCKFILE`.
- `.dockerignore` patterns are not recursive — a bare `*.tsbuildinfo` misses nested ones, and a stale `lib/db/tsconfig.tsbuildinfo` makes `tsc --build` emit nothing (TS6305).
- `.gitattributes` pins `*.sh` to LF. A CRLF `docker-entrypoint.sh` bakes `#!/bin/sh` into the image; the container then dies with a misleading "no such file or directory".
- `UPLOAD_DIR` is a root-owned Coolify volume. The entrypoint chowns it and drops to `node` via `gosu` — do not add a bare `USER node`.

## Verifying

- **A 200 proves nothing.** The SPA fallback returns 200 + `index.html` for every unmatched GET, so `/sitemap.xml`, `/llms.txt` and `/favicon.ico` all "pass" a status check while serving HTML. Assert on content or `Content-Type`.
- **You cannot sign in over `http://localhost`.** With `NODE_ENV=production` the session cookie is `Secure` and the browser will not store it on plain HTTP — login returns 200 and nothing happens. To exercise any authenticated screen locally, run a second container with `NODE_ENV=development` on another port.
- **Never gate auth on `document.cookie`.** The session cookie is `httpOnly` and therefore invisible to it. Doing so once broke sign-in for every admin and parent in production: the check could never be true, `/api/auth/me` was never called, and `/auth-redirect` bounced back to `/sign-in` in a loop.
- `docker restart` reuses the container's original image; `docker rm -f` + `docker run` is what picks up a rebuild.
- Git Bash mangles `BASE_PATH=/` into a Windows path — prefix with `MSYS_NO_PATHCONV=1` or use PowerShell.

## Gotchas

- Always run the `api-spec` `codegen` script after editing `openapi.yaml` — don't hand-edit generated files.
- Always run `pnpm --filter @workspace/db run push` after editing files under `lib/db/src/schema/`.
- The API server bundles with esbuild; restart it (`pnpm --filter @workspace/api-server run dev`) after backend code changes — it won't hot-reload.
- `app.set("trust proxy", 1)` in `artifacts/api-server/src/app.ts` is required for secure session cookies behind the reverse proxy that terminates TLS (Coolify's Traefik) — removing it silently breaks login (`req.secure` goes false, `Set-Cookie` gets dropped).
- File uploads (`artifacts/api-server/src/lib/objectStorage.ts`, `routes/storage.ts`) are stored on local disk under `UPLOAD_DIR` (default `/data/uploads`). **`UPLOAD_DIR` must be mounted as a persistent Coolify volume, not left as regular container storage** — otherwise every uploaded file (e.g. student photos) is lost on the next redeploy.
