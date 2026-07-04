import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import {
  CreateStudentBody,
  DeleteStudentParams,
  GetStudentParams,
  GetStudentResponse,
  ListStudentsResponse,
  UpdateStudentBody,
  UpdateStudentParams,
  UpdateStudentResponse,
} from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../lib/authMiddleware";

const router: IRouter = Router();

const toStudent = (s: typeof studentsTable.$inferSelect) => ({
  ...s,
  joinedAt: s.joinedAt.toISOString(),
});

router.get("/students", requireAuth, async (req, res): Promise<void> => {
  const students = await db.select().from(studentsTable).orderBy(studentsTable.joinedAt);
  if (req.session.role === "admin") {
    res.json(ListStudentsResponse.parse(students.map(toStudent)));
    return;
  }
  const email = req.session.email?.toLowerCase();
  const mine = students.filter(s => s.parentEmail?.toLowerCase() === email);
  res.json(ListStudentsResponse.parse(mine.map(toStudent)));
});

router.post("/students", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [student] = await db.insert(studentsTable).values(parsed.data).returning();
  res.status(201).json(GetStudentResponse.parse(toStudent(student)));
});

router.get("/students/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, params.data.id));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  if (req.session.role !== "admin" && student.parentEmail?.toLowerCase() !== req.session.email?.toLowerCase()) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json(GetStudentResponse.parse(toStudent(student)));
});

router.patch("/students/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateStudentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [student] = await db.update(studentsTable).set(parsed.data).where(eq(studentsTable.id, params.data.id)).returning();
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json(UpdateStudentResponse.parse(toStudent(student)));
});

router.delete("/students/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteStudentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [student] = await db.delete(studentsTable).where(eq(studentsTable.id, params.data.id)).returning();
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
