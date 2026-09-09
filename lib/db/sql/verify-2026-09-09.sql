-- Confirms the 2026-09-09 intake migration landed. Read-only.
-- Every row should report 'ok'.

SELECT
  object,
  CASE WHEN present THEN 'ok' ELSE 'MISSING' END AS status
FROM (
  SELECT 'intake.child_year_group'          AS object, EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'child_year_group')         AS present
  UNION ALL SELECT 'intake.sen_notes',                 EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'sen_notes')
  UNION ALL SELECT 'intake.relationship_to_child',     EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'relationship_to_child')
  UNION ALL SELECT 'intake.alt_contact_number',        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'alt_contact_number')
  UNION ALL SELECT 'intake.preferred_contact_method',  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'preferred_contact_method')
  UNION ALL SELECT 'intake.marketing_opt_in',          EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'marketing_opt_in')
  UNION ALL SELECT 'intake.converted_student_id',      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'intake_submissions' AND column_name = 'converted_student_id')
) checks
ORDER BY status DESC, object;

-- Nothing lost: these predate the migration and must survive.
SELECT
  'existing data intact' AS check,
  (SELECT count(*) FROM intake_submissions) AS applications,
  (SELECT count(*) FROM students)           AS students,
  (SELECT count(*) FROM users)              AS users;
