-- Confirms the 2026-09-08 migration landed. Read-only: selects nothing but
-- catalogue metadata, writes nothing, safe to run against production any time.
--
-- Every row should report 'ok'.
--
--   Get-Content .\lib\db\sql\verify-migration.sql -Raw | ssh root@HOST 'docker exec -i $(docker ps -qf name=DBUUID) psql -U postgres -d postgres'

SELECT
  object,
  CASE WHEN present THEN 'ok' ELSE 'MISSING' END AS status
FROM (
  SELECT 'reviews (table)'                AS object, to_regclass('public.reviews')            IS NOT NULL AS present
  UNION ALL SELECT 'session_attendance (table)', to_regclass('public.session_attendance')     IS NOT NULL
  UNION ALL SELECT 'reviews.google_review_id idx', to_regclass('public.reviews_google_review_id_key') IS NOT NULL
  UNION ALL SELECT 'attendance unique idx',        to_regclass('public.attendance_session_student_key') IS NOT NULL
  UNION ALL SELECT 'staff.dbs_certificate_number', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff'    AND column_name = 'dbs_certificate_number')
  UNION ALL SELECT 'staff.dbs_expiry_date',        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff'    AND column_name = 'dbs_expiry_date')
  UNION ALL SELECT 'sessions.staff_id',            EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sessions' AND column_name = 'staff_id')
  UNION ALL SELECT 'settings.google_place_id',     EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'google_place_id')
  UNION ALL SELECT 'settings.google_api_key',      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'google_api_key')
  UNION ALL SELECT 'settings.google_reviews_enabled',   EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'google_reviews_enabled')
  UNION ALL SELECT 'settings.google_reviews_synced_at', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'google_reviews_synced_at')
) checks
ORDER BY status DESC, object;

-- Also confirm nothing was lost: these predate the migration and must survive.
SELECT
  'existing data intact' AS check,
  (SELECT count(*) FROM students) AS students,
  (SELECT count(*) FROM staff)    AS staff,
  (SELECT count(*) FROM sessions) AS sessions,
  (SELECT count(*) FROM users)    AS users;
