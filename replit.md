# Thurrock Tuition Academy

A complete web platform for Khadija's tutoring business in Grays, Thurrock — including a public-facing landing page, a full admin dashboard, and a parent portal.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string; `SESSION_SECRET` — express-session signing secret; `ADMIN_EMAIL` — email that gets `admin` role on signup (defaults to `admin@thurrocktuitionacademy.co.uk`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, shadcn/ui, Wouter routing, cookie-session auth, TanStack Query
- API: Express 5 + express-session (bcrypt password auth, no third-party auth provider)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — Source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle schema files (enquiries, students, sessions, progress, tasks, payments)
- `lib/api-client-react/src/generated/api.ts` — Generated React Query hooks
- `lib/api-zod/src/generated/` — Generated Zod schemas
- `artifacts/api-server/src/routes/` — Express route handlers (one file per resource)
- `artifacts/thurrock-tuition/src/pages/` — All frontend pages
- `artifacts/thurrock-tuition/src/components/layout/admin-layout.tsx` — Sidebar layout for admin pages
- `artifacts/thurrock-tuition/src/index.css` — Navy/gold theme variables

## Architecture decisions

- **Contract-first API**: OpenAPI spec defined in `lib/api-spec`, codegen produces hooks + Zod schemas for both client and server
- **Custom session auth**: Email/password auth (bcrypt-hashed, `bcryptjs`) backed by `express-session` + `connect-pg-simple`, replacing an earlier Clerk-based design. Session data (`userId`, `role`, `email`) lives server-side in the `user_sessions` Postgres table; the client only holds the `tta.sid` cookie (`httpOnly`, `sameSite: lax`, `secure` in production). Role is assigned at signup: the email matching `ADMIN_EMAIL` becomes `admin`, everyone else is `parent`. Routes: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
- **Wouter routing**: Lightweight client-side router; all routes nested under `BASE_URL` for correct iframe proxy routing
- **Role differentiation by route**: Admin dashboard at `/dashboard`, parent portal at `/parent` — both gated by session sign-in
- **No mocked data**: All data served from live PostgreSQL via Drizzle ORM

## Product

- **Public landing page** (`/`): Hero, Why Choose TTA, Subjects & Levels, Pricing, WhatsApp booking CTA
- **Admin dashboard** (`/dashboard`): Key stats (students, enquiries, sessions, payments)
- **Enquiries** (`/enquiries`): View and manage all inbound enquiries; update status + notes
- **Students** (`/students`): Full student list; add new students; search by name/parent/subject
- **Student detail** (`/students/:id`): Per-student progress notes, tasks, and payment records; all fully interactive
- **Sessions** (`/sessions`): Schedule sessions; view slot availability overview
- **Progress** (`/progress`): All progress notes across all students
- **Tasks** (`/tasks`): All homework/tasks across all students; filter pending/done; toggle completion
- **Payments** (`/payments`): Outstanding and paid payment records; mark as paid
- **Parent portal** (`/parent`): Read-only view of a child's progress notes, tasks, and payments

## User preferences

- Business name: Thurrock Tuition Academy (TTA)
- Owner: Khadija
- Location: Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock
- WhatsApp: 07480413679
- Colors: Navy (#1B2B6B) primary, Gold (#C9973A) secondary
- Font: Crimson Pro (serif headings), Inter (body)

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `openapi.yaml`
- Always run `pnpm --filter @workspace/db run push` after editing DB schema files
- API server must be restarted after code changes (it bundles with esbuild)
- `connect-pg-simple`'s `createTableIfMissing` is set to `false` — its schema asset isn't bundled by esbuild, so the `user_sessions` table must exist via migration, not auto-creation
- Express applies no auth by default — every route handler must explicitly add `requireAuth`/`requireAdmin`/an ownership check (see `.agents/memory/express-routes-default-public.md`)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
