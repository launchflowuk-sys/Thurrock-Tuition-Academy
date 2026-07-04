---
name: Express routes default to public
description: Express has no implicit auth gate; every route file must explicitly apply middleware or it silently serves data/writes to anyone.
---

In this project's Express + session-based auth setup, routes are public by default. There is no global "protected by default" middleware — each route file must import and apply `requireAuth` / `requireAdmin` (or an ownership check) itself.

**Why:** A full production audit found that nearly every resource route (enquiries, students, sessions, progress, tasks, payments, messages, staff, courses, settings, dashboard) had zero auth applied, publicly exposing all student/parent PII and allowing unauthenticated writes/deletes. Only the auth routes themselves had any auth logic. This shipped to production undetected because each route "worked" — it just worked for anyone.

**How to apply:**
- When adding a new resource route file, add auth middleware to every handler as the first thing you do, before writing business logic.
- Use `requireAdmin` for admin-only resources (staff, settings, courses, sessions, dashboard, enquiries/intake management).
- For resources with a parent/owner relationship (students, progress, tasks, payments, messages), use an ownership-check helper (e.g. `ownsStudent`) so parents can read only their own child's data, admins can read everything, and mutations stay admin-only.
- Leave intentionally public endpoints public only when there's a clear reason (e.g. public contact-form POST, public widget-config GET with no secrets) — comment why.
- After any auth change to routes, verify with curl both with and without a session cookie (expect 401/403 unauthenticated, 200 for legitimate roles) — don't rely on typecheck alone, since missing middleware is not a type error.
- Periodically audit the full route list (`grep` for `router.get/post/patch/delete` across route files) against which ones have auth middleware, since it's easy for one file to be missed.
