-- 2026-09-09 — fuller assessment form + application-to-student conversion.
--
-- Add-only and idempotent: every statement is IF NOT EXISTS and every new
-- column is nullable or carries a default, so the app can be rolled back to
-- the previous image without touching the database.
--
-- MUST be applied BEFORE the deploy that ships the matching build — the API
-- selects these columns and the public homepage 500s if they are absent.
--
--   Get-Content .\lib\db\sql\2026-09-09-intake-full-detail.sql -Raw | ssh root@178.105.149.221 'docker exec -i $(docker ps -qf name=j4m1f7m1pitlbzm4i0vh56ix) psql -U postgres -d postgres -v ON_ERROR_STOP=1'

BEGIN;

-- The child
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS child_year_group           text;
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS sen_notes                  text;

-- The parent or guardian
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS relationship_to_child      text;
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS alt_contact_number         text;
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS preferred_contact_method   text;

-- Consent and conversion
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS marketing_opt_in           boolean NOT NULL DEFAULT false;
ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS converted_student_id       integer;

COMMIT;
