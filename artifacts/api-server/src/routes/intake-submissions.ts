import { Router, type IRouter } from "express";
import { eq, and, isNull } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { db, intakeSubmissionsTable, settingsTable, studentsTable } from "@workspace/db";
import {
  ConvertIntakeSubmissionBody,
  ConvertIntakeSubmissionParams,
  CreateIntakeSubmissionBody,
  ListIntakeSubmissionsResponse,
  UpdateIntakeSubmissionBody,
  UpdateIntakeSubmissionParams,
  UpdateIntakeSubmissionResponse,
} from "@workspace/api-zod";
import { sendIntakeEmails, sendIntakeReplyEmail } from "../lib/email";
import { readSecret } from "../lib/paymentSettings";
import { requireAdmin } from "../lib/authMiddleware";
import { intakeLimiter } from "../lib/rateLimit";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const toIntake = (s: typeof intakeSubmissionsTable.$inferSelect) => ({ ...s, createdAt: s.createdAt.toISOString() });

const toStudent = (s: typeof studentsTable.$inferSelect) => ({ ...s, joinedAt: s.joinedAt.toISOString() });

router.get("/intake", requireAdmin, async (req, res): Promise<void> => {
  const rows = await db.select().from(intakeSubmissionsTable).orderBy(desc(intakeSubmissionsTable.createdAt));
  res.json(ListIntakeSubmissionsResponse.parse(rows.map(toIntake)));
});

router.post("/intake", intakeLimiter, async (req, res): Promise<void> => {
  const parsed = CreateIntakeSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(intakeSubmissionsTable).values(parsed.data).returning();
  res.status(201).json(toIntake(row));

  sendIntakeEmails({
    parentName: parsed.data.parentName,
    relationshipToChild: parsed.data.relationshipToChild,
    childName: parsed.data.childName,
    childAge: parsed.data.childAge,
    childYearGroup: parsed.data.childYearGroup,
    subject: parsed.data.subject,
    level: parsed.data.level,
    email: parsed.data.email,
    contactNumber: parsed.data.contactNumber,
    altContactNumber: parsed.data.altContactNumber,
    preferredContactMethod: parsed.data.preferredContactMethod,
    currentSchool: parsed.data.currentSchool,
    goals: parsed.data.goals,
    currentAttainment: parsed.data.currentAttainment,
    senNotes: parsed.data.senNotes,
    previousTutoring: parsed.data.previousTutoring,
    howDidYouHear: parsed.data.howDidYouHear,
    preferredSlot: parsed.data.preferredSlot,
    additionalInfo: parsed.data.additionalInfo,
  }).catch((err) => logger.error({ err }, "Failed to send intake emails"));
});

router.patch("/intake/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateIntakeSubmissionParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateIntakeSubmissionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(intakeSubmissionsTable).set(parsed.data).where(eq(intakeSubmissionsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateIntakeSubmissionResponse.parse(toIntake(row)));
});

router.delete("/intake/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(intakeSubmissionsTable).where(eq(intakeSubmissionsTable.id, id));
  res.status(204).send();
});

/**
 * Promote an application into a real student record.
 *
 * The application is the source of truth for everything the parent typed, so
 * nothing is retyped here — only `sessionSlot` needs a decision, because
 * `students.sessionSlot` is NOT NULL and a preferred slot is optional on the
 * form. Anything the applicant left blank becomes "To be confirmed" rather
 * than an empty string, so the students table never shows a blank column.
 *
 * `converted_student_id` guards against a double click creating twin records:
 * the UPDATE that claims the application is conditional on that column still
 * being NULL, so the second request finds no row and gets a 409.
 */
router.post("/intake/:id/convert", requireAdmin, async (req, res): Promise<void> => {
  const params = ConvertIntakeSubmissionParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const overrides = ConvertIntakeSubmissionBody.safeParse(req.body ?? {});
  if (!overrides.success) { res.status(400).json({ error: overrides.error.message }); return; }

  const [submission] = await db.select().from(intakeSubmissionsTable).where(eq(intakeSubmissionsTable.id, params.data.id));
  if (!submission) { res.status(404).json({ error: "Not found" }); return; }
  if (submission.convertedStudentId !== null) {
    res.status(409).json({ error: "This application has already been converted to a student.", studentId: submission.convertedStudentId });
    return;
  }

  // Everything the parent told us that has no column on `students` is kept as
  // the student's opening note, so promoting an application loses nothing.
  const carried = [
    submission.childYearGroup ? `Year group: ${submission.childYearGroup}` : null,
    submission.currentSchool ? `School: ${submission.currentSchool}` : null,
    submission.currentAttainment ? `Attainment at application: ${submission.currentAttainment}` : null,
    submission.senNotes ? `SEN / additional needs: ${submission.senNotes}` : null,
    submission.goals ? `Goals: ${submission.goals}` : null,
    submission.previousTutoring ? `Struggling with: ${submission.previousTutoring}` : null,
    submission.relationshipToChild ? `Parent relationship: ${submission.relationshipToChild}` : null,
    submission.altContactNumber ? `Alternative number: ${submission.altContactNumber}` : null,
    submission.preferredContactMethod ? `Prefers contact by: ${submission.preferredContactMethod}` : null,
    submission.additionalInfo ? `Additional info: ${submission.additionalInfo}` : null,
    overrides.data.notes ? overrides.data.notes : null,
    `Converted from application #${submission.id}, submitted ${submission.createdAt.toLocaleDateString("en-GB")}.`,
  ].filter(Boolean).join("\n");

  const [student] = await db.insert(studentsTable).values({
    name: submission.childName,
    age: submission.childAge,
    parentName: submission.parentName,
    contactNumber: submission.contactNumber,
    subject: submission.subject,
    level: submission.level,
    sessionSlot: overrides.data.sessionSlot || submission.preferredSlot || "To be confirmed",
    parentEmail: submission.email,
    notes: carried,
  }).returning();

  // Claim the application only if nobody else already has. A second click
  // matches no row here, so it cannot end up pointing at a different student.
  const claimed = await db.update(intakeSubmissionsTable)
    .set({ convertedStudentId: student.id, status: "enrolled" })
    .where(and(eq(intakeSubmissionsTable.id, submission.id), isNull(intakeSubmissionsTable.convertedStudentId)))
    .returning();

  if (claimed.length === 0) {
    // Lost the race: roll back the student we just created so the duplicate
    // does not linger, and report the winner.
    await db.delete(studentsTable).where(eq(studentsTable.id, student.id));
    const [fresh] = await db.select().from(intakeSubmissionsTable).where(eq(intakeSubmissionsTable.id, submission.id));
    res.status(409).json({ error: "This application has already been converted to a student.", studentId: fresh?.convertedStudentId ?? undefined });
    return;
  }

  res.status(201).json(toStudent(student));
});

router.post("/intake/:id/reply", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { subject, body } = req.body as { subject?: string; body?: string };
  if (!subject || !body) { res.status(400).json({ error: "subject and body are required" }); return; }

  const [submission] = await db.select().from(intakeSubmissionsTable).where(eq(intakeSubmissionsTable.id, id));
  if (!submission) { res.status(404).json({ error: "Not found" }); return; }

  const [settings] = await db.select().from(settingsTable).limit(1);
  if (!settings?.smtpEnabled || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
    res.status(400).json({ error: "SMTP not configured. Please set up email in Settings first." });
    return;
  }

  // smtpPass is AES-256-GCM at rest (routes/settings.ts). Handing the stored
  // ciphertext straight to nodemailer authenticates with the wrong password
  // and every reply fails; readSecret passes through values written before
  // encryption existed, so this is safe on a part-migrated database too.
  const smtpPass = readSecret(settings.smtpPass);
  if (!smtpPass) {
    res.status(400).json({ error: "The stored SMTP password could not be read. Re-enter it in Settings → Email." });
    return;
  }

  await sendIntakeReplyEmail({
    toEmail: submission.email,
    toName: submission.parentName,
    childName: submission.childName,
    subjectTaught: submission.subject,
    level: submission.level,
    replySubject: subject,
    replyBody: body,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort ?? 587,
    smtpUser: settings.smtpUser,
    smtpPass,
    smtpFrom: settings.smtpFrom ?? settings.smtpUser,
  });

  res.json({ ok: true });
});

export default router;
