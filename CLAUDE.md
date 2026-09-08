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

**Routing (frontend)**: Wouter, all routes nested under `BASE_URL` (`artifacts/thurrock-tuition/src/App.tsx`). Public marketing pages (`/`, `/services`, `/about`, `/contact`) are unauthenticated; `/dashboard`, `/students`, `/sessions`, `/progress`, `/tasks`, `/payments`, `/settings`, `/staff`, `/intake`, `/courses` are wrapped in `AdminRoute` (redirects non-admins to the parent portal); `/parent` is wrapped in `ParentRoute`. Auth state comes from `AuthProvider`/`useAuth` in `src/lib/auth-context`, driven by the session cookie, not a token.

**Secrets at rest**: every credential column in `settings` (SMTP password, Square, PayPal, Stripe) is encrypted with AES-256-GCM via `lib/encryption.ts` before being written, and decrypted on read through `readSecret` in `lib/paymentSettings.ts`. `ENCRYPTED_SETTINGS_FIELDS` is the canonical list — keep the `encrypt()` calls in `routes/settings.ts` and the migration script in sync with it. Values written before encryption existed are passed through untouched, so a partially-migrated database keeps working; `pnpm --filter @workspace/api-server run migrate:encrypt-settings` converts them.

**No mocked data** — everything is served from Postgres via Drizzle.

**Theme**: Navy (`#1B2B6B`) primary, Gold (`#C9973A`) secondary; Crimson Pro for serif headings, Inter for body — see `artifacts/thurrock-tuition/src/index.css`.

## Gotchas

- Always run the `api-spec` `codegen` script after editing `openapi.yaml` — don't hand-edit generated files.
- Always run `pnpm --filter @workspace/db run push` after editing files under `lib/db/src/schema/`.
- The API server bundles with esbuild; restart it (`pnpm --filter @workspace/api-server run dev`) after backend code changes — it won't hot-reload.
- `app.set("trust proxy", 1)` in `artifacts/api-server/src/app.ts` is required for secure session cookies behind the reverse proxy that terminates TLS (Coolify's Traefik) — removing it silently breaks login (`req.secure` goes false, `Set-Cookie` gets dropped).
- File uploads (`artifacts/api-server/src/lib/objectStorage.ts`, `routes/storage.ts`) are stored on local disk under `UPLOAD_DIR` (default `/data/uploads`). **`UPLOAD_DIR` must be mounted as a persistent Coolify volume, not left as regular container storage** — otherwise every uploaded file (e.g. student photos) is lost on the next redeploy.
