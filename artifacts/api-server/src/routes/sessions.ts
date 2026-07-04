import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, sessionsTable } from "@workspace/db";
import {
  CreateSessionBody,
  GetSessionParams,
  GetSessionResponse,
  ListSessionsResponse,
  UpdateSessionBody,
  UpdateSessionParams,
  UpdateSessionResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/authMiddleware";

const router: IRouter = Router();

const toSession = (s: typeof sessionsTable.$inferSelect) => ({
  ...s,
  studentIds: s.studentIds ?? [],
  createdAt: s.createdAt.toISOString(),
});

router.get("/sessions", requireAdmin, async (_req, res): Promise<void> => {
  const sessions = await db.select().from(sessionsTable).orderBy(sessionsTable.date);
  res.json(ListSessionsResponse.parse(sessions.map(toSession)));
});

router.post("/sessions", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [session] = await db.insert(sessionsTable).values(parsed.data).returning();
  res.status(201).json(GetSessionResponse.parse(toSession(session)));
});

router.get("/sessions/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = GetSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, params.data.id));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json(GetSessionResponse.parse(toSession(session)));
});

router.patch("/sessions/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateSessionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [session] = await db.update(sessionsTable).set(parsed.data).where(eq(sessionsTable.id, params.data.id)).returning();
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json(UpdateSessionResponse.parse(toSession(session)));
});

export default router;
