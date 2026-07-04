import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, intakeSubmissionsTable, settingsTable } from "@workspace/db";
import {
  CreateIntakeSubmissionBody,
  ListIntakeSubmissionsResponse,
  UpdateIntakeSubmissionBody,
  UpdateIntakeSubmissionParams,
  UpdateIntakeSubmissionResponse,
} from "@workspace/api-zod";
import { sendIntakeEmails, sendIntakeReplyEmail } from "../lib/email";
import { requireAdmin } from "../lib/authMiddleware";

const router: IRouter = Router();

const toIntake = (s: typeof intakeSubmissionsTable.$inferSelect) => ({ ...s, createdAt: s.createdAt.toISOString() });

router.get("/intake", requireAdmin, async (req, res): Promise<void> => {
  const rows = await db.select().from(intakeSubmissionsTable).orderBy(desc(intakeSubmissionsTable.createdAt));
  res.json(ListIntakeSubmissionsResponse.parse(rows.map(toIntake)));
});

router.post("/intake", async (req, res): Promise<void> => {
  const parsed = CreateIntakeSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db.insert(intakeSubmissionsTable).values(parsed.data).returning();
  res.status(201).json(toIntake(row));

  sendIntakeEmails({
    parentName: parsed.data.parentName,
    childName: parsed.data.childName,
    childAge: parsed.data.childAge,
    subject: parsed.data.subject,
    level: parsed.data.level,
    email: parsed.data.email,
    contactNumber: parsed.data.contactNumber,
    currentSchool: parsed.data.currentSchool,
    goals: parsed.data.goals,
    currentAttainment: parsed.data.currentAttainment,
    previousTutoring: parsed.data.previousTutoring,
    howDidYouHear: parsed.data.howDidYouHear,
    preferredSlot: parsed.data.preferredSlot,
  }).catch(() => {});
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

  await sendIntakeReplyEmail({
    toEmail: submission.email,
    toName: submission.parentName,
    childName: submission.childName,
    replySubject: subject,
    replyBody: body,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort ?? 587,
    smtpUser: settings.smtpUser,
    smtpPass: settings.smtpPass,
    smtpFrom: settings.smtpFrom ?? settings.smtpUser,
  });

  res.json({ ok: true });
});

export default router;
