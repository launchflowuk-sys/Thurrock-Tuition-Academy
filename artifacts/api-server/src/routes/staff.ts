import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, staffTable } from "@workspace/db";
import {
  ListStaffResponse,
  CreateStaffBody,
  GetStaffParams,
  GetStaffResponse,
  UpdateStaffBody,
  UpdateStaffParams,
  UpdateStaffResponse,
  DeleteStaffParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/authMiddleware";

const router: IRouter = Router();

const toStaff = (s: typeof staffTable.$inferSelect) => ({
  ...s,
  hourlyRate: s.hourlyRate !== null ? Number(s.hourlyRate) : null,
  joinedAt: s.joinedAt.toISOString(),
});

router.get("/staff", requireAdmin, async (_req, res): Promise<void> => {
  const staff = await db.select().from(staffTable).orderBy(staffTable.joinedAt);
  res.json(ListStaffResponse.parse(staff.map(toStaff)));
});

router.post("/staff", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateStaffBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db.insert(staffTable).values({
    ...parsed.data,
    hourlyRate: parsed.data.hourlyRate !== undefined ? String(parsed.data.hourlyRate) : null,
  }).returning();
  res.status(201).json(GetStaffResponse.parse(toStaff(member)));
});

router.get("/staff/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = GetStaffParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [member] = await db.select().from(staffTable).where(eq(staffTable.id, params.data.id));
  if (!member) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }
  res.json(GetStaffResponse.parse(toStaff(member)));
});

router.patch("/staff/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateStaffParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateStaffBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.hourlyRate !== undefined) {
    updateData.hourlyRate = String(parsed.data.hourlyRate);
  }
  const [member] = await db.update(staffTable).set(updateData).where(eq(staffTable.id, params.data.id)).returning();
  if (!member) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }
  res.json(UpdateStaffResponse.parse(toStaff(member)));
});

router.delete("/staff/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteStaffParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [member] = await db.delete(staffTable).where(eq(staffTable.id, params.data.id)).returning();
  if (!member) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
