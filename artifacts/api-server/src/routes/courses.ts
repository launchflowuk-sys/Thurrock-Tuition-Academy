import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, coursesTable } from "@workspace/db";
import {
  CreateCourseBody,
  ListCoursesResponse,
  UpdateCourseBody,
  UpdateCourseParams,
  UpdateCourseResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toCourse = (c: typeof coursesTable.$inferSelect) => ({
  ...c,
  price: Number(c.price),
  createdAt: c.createdAt.toISOString(),
});

router.get("/courses", async (req, res): Promise<void> => {
  const rows = await db.select().from(coursesTable).orderBy(asc(coursesTable.displayOrder), asc(coursesTable.createdAt));
  res.json(ListCoursesResponse.parse(rows.map(toCourse)));
});

router.post("/courses", async (req, res): Promise<void> => {
  const parsed = CreateCourseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(coursesTable).values({
    ...parsed.data,
    price: String(parsed.data.price),
  }).returning();
  res.status(201).json(toCourse(row));
});

router.patch("/courses/:id", async (req, res): Promise<void> => {
  const params = UpdateCourseParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateCourseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { price: rawPrice, ...restData } = parsed.data;
  const updateData = { ...restData, ...(rawPrice !== undefined ? { price: String(rawPrice) } : {}) };
  const [row] = await db.update(coursesTable).set(updateData).where(eq(coursesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateCourseResponse.parse(toCourse(row)));
});

router.delete("/courses/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(coursesTable).where(eq(coursesTable.id, id));
  res.status(204).send();
});

export default router;
