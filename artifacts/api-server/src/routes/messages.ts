import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, messagesTable } from "@workspace/db";
import {
  ListMessagesQueryParams,
  ListMessagesResponse,
  SendMessageBody,
  MarkMessageReadParams,
  MarkMessageReadResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toMessage = (m: typeof messagesTable.$inferSelect) => ({
  ...m,
  createdAt: m.createdAt.toISOString(),
  readAt: m.readAt?.toISOString() ?? null,
});

router.get("/messages", async (req, res): Promise<void> => {
  const params = ListMessagesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.studentId, Number(params.data.studentId)))
    .orderBy(messagesTable.createdAt);
  res.json(ListMessagesResponse.parse(messages.map(toMessage)));
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [message] = await db.insert(messagesTable).values(parsed.data).returning();
  res.status(201).json(toMessage(message));
});

router.patch("/messages/:id/read", async (req, res): Promise<void> => {
  const params = MarkMessageReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [message] = await db
    .update(messagesTable)
    .set({ readAt: new Date() })
    .where(eq(messagesTable.id, Number(params.data.id)))
    .returning();
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(MarkMessageReadResponse.parse(toMessage(message)));
});

export default router;
