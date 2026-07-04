import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, progressNotesTable } from "@workspace/db";
import {
  CreateProgressNoteBody,
  DeleteProgressNoteParams,
  ListProgressNotesQueryParams,
  ListProgressNotesResponse,
  UpdateProgressNoteBody,
  UpdateProgressNoteParams,
  UpdateProgressNoteResponse,
} from "@workspace/api-zod";
import { requireAuth, requireAdmin, ownsStudent } from "../lib/authMiddleware";

const router: IRouter = Router();

const toNote = (n: typeof progressNotesTable.$inferSelect) => ({
  ...n,
  createdAt: n.createdAt.toISOString(),
});

router.get("/progress", requireAuth, async (req, res): Promise<void> => {
  const query = ListProgressNotesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  if (query.data.studentId == null) {
    if (req.session.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const notes = await db.select().from(progressNotesTable).orderBy(progressNotesTable.createdAt);
    res.json(ListProgressNotesResponse.parse(notes.map(toNote)));
    return;
  }
  if (!(await ownsStudent(req, query.data.studentId))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const notes = await db.select().from(progressNotesTable).where(eq(progressNotesTable.studentId, query.data.studentId)).orderBy(progressNotesTable.createdAt);
  res.json(ListProgressNotesResponse.parse(notes.map(toNote)));
});

router.post("/progress", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateProgressNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [note] = await db.insert(progressNotesTable).values(parsed.data).returning();
  res.status(201).json(toNote(note));
});

router.patch("/progress/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateProgressNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProgressNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [note] = await db.update(progressNotesTable).set(parsed.data).where(eq(progressNotesTable.id, params.data.id)).returning();
  if (!note) {
    res.status(404).json({ error: "Progress note not found" });
    return;
  }
  res.json(UpdateProgressNoteResponse.parse(toNote(note)));
});

router.delete("/progress/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteProgressNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [note] = await db.delete(progressNotesTable).where(eq(progressNotesTable.id, params.data.id)).returning();
  if (!note) {
    res.status(404).json({ error: "Progress note not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
