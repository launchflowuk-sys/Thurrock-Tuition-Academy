import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, intakeSubmissionsTable } from "@workspace/db";
import {
  CreateIntakeSubmissionBody,
  ListIntakeSubmissionsResponse,
  UpdateIntakeSubmissionBody,
  UpdateIntakeSubmissionParams,
  UpdateIntakeSubmissionResponse,
} from "@workspace/api-zod";
import { sendIntakeEmails } from "../lib/email";

const router: IRouter = Router();

const toIntake = (s: typeof intakeSubmissionsTable.$inferSelect) => ({ ...s, createdAt: s.createdAt.toISOString() });

router.get("/intake", async (req, res): Promise<void> => {
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
  }).catch(() => {});
});

router.patch("/intake/:id", async (req, res): Promise<void> => {
  const params = UpdateIntakeSubmissionParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateIntakeSubmissionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(intakeSubmissionsTable).set(parsed.data).where(eq(intakeSubmissionsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateIntakeSubmissionResponse.parse(toIntake(row)));
});

router.delete("/intake/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(intakeSubmissionsTable).where(eq(intakeSubmissionsTable.id, id));
  res.status(204).send();
});

export default router;
