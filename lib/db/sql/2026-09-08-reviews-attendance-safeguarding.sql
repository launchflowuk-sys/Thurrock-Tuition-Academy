-- Schema changes for the redesign release (reviews, attendance, safeguarding,
-- Google review sync). Written for the LIVE Thurrock Tuition Academy database.
--
-- MUST be applied BEFORE the new build is deployed. The new code selects these
-- columns and tables; without them the public homepage (reviews), the sessions
-- list, the staff list, settings and the dashboard all return 500.
--
-- Safety properties, deliberately:
--   * Every statement is IF NOT EXISTS guarded — re-running it is a no-op.
--   * Nothing is dropped, renamed or altered in place. No existing column
--     changes type, nullability or default, so a rollback to the previous
--     build keeps working against this schema unchanged.
--   * New NOT NULL columns all carry defaults, so existing rows backfill
--     without a table rewrite lock.
--
-- The `enquiries` table is intentionally NOT dropped. It is unused by the new
-- code, but it may still hold historic enquiries and dropping it is
-- irreversible. Remove it by hand later, after taking a backup, if you want to.

BEGIN;

-- ---------------------------------------------------------------------------
-- Parent reviews, shown on the public homepage.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "reviews" (
  "id"                serial PRIMARY KEY,
  "source"            text NOT NULL DEFAULT 'manual',
  "author_name"       text NOT NULL,
  "author_photo_url"  text,
  "rating"            integer NOT NULL,
  "body"              text NOT NULL,
  "relationship"      text,
  "reviewed_at"       timestamp with time zone,
  "google_review_id"  text,
  "is_visible"        boolean NOT NULL DEFAULT true,
  "display_order"     integer NOT NULL DEFAULT 0,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now()
);

-- Google's per-review id is what makes a re-sync update in place instead of
-- duplicating. Unique so a double-sync cannot create two rows for one review.
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_google_review_id_key"
  ON "reviews" ("google_review_id");

-- ---------------------------------------------------------------------------
-- Session attendance — one row per student per session.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "session_attendance" (
  "id"          serial PRIMARY KEY,
  "session_id"  integer NOT NULL,
  "student_id"  integer NOT NULL,
  "status"      text NOT NULL DEFAULT 'present',
  "notes"       text,
  "recorded_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- A student is marked once per session; re-marking updates that row.
CREATE UNIQUE INDEX IF NOT EXISTS "attendance_session_student_key"
  ON "session_attendance" ("session_id", "student_id");

-- ---------------------------------------------------------------------------
-- Safeguarding: enhanced DBS per staff member.
-- Nullable — existing rows predate this, and a null reads as "not recorded",
-- which the dashboard counts separately from "expiring".
-- ---------------------------------------------------------------------------
ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "dbs_certificate_number" text;
ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "dbs_expiry_date" text;

-- ---------------------------------------------------------------------------
-- The tutor taking a session. Null means unassigned, which the dashboard
-- surfaces as an amber attention figure.
-- ---------------------------------------------------------------------------
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "staff_id" integer;

-- ---------------------------------------------------------------------------
-- Google Business Profile review sync settings. The API key is encrypted at
-- rest by the application before it is written here.
-- ---------------------------------------------------------------------------
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "google_place_id" text;
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "google_api_key" text;
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "google_reviews_enabled" boolean NOT NULL DEFAULT false;
ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "google_reviews_synced_at" timestamp with time zone;

COMMIT;

-- Verification — every row should report 'ok':
--
--   SELECT 'reviews'            AS object, CASE WHEN to_regclass('public.reviews')            IS NOT NULL THEN 'ok' ELSE 'MISSING' END
--   UNION ALL SELECT 'session_attendance', CASE WHEN to_regclass('public.session_attendance') IS NOT NULL THEN 'ok' ELSE 'MISSING' END
--   UNION ALL SELECT 'staff.dbs_expiry_date',    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='staff'    AND column_name='dbs_expiry_date')          THEN 'ok' ELSE 'MISSING' END
--   UNION ALL SELECT 'sessions.staff_id',        CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='staff_id')                  THEN 'ok' ELSE 'MISSING' END
--   UNION ALL SELECT 'settings.google_place_id', CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='google_place_id')           THEN 'ok' ELSE 'MISSING' END;
