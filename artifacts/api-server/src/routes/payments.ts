import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, paymentsTable } from "@workspace/db";
import {
  CreatePaymentBody,
  ListPaymentsQueryParams,
  ListPaymentsResponse,
  SendPaymentLinkBody,
  UpdatePaymentBody,
  UpdatePaymentParams,
  UpdatePaymentResponse,
} from "@workspace/api-zod";
import { requireAuth, requireAdmin, ownsStudent } from "../lib/authMiddleware";
import { createAndSendPaymentLink } from "../lib/square";

const router: IRouter = Router();

const toPayment = (p: typeof paymentsTable.$inferSelect) => ({
  ...p,
  amount: Number(p.amount),
  createdAt: p.createdAt.toISOString(),
});

router.get("/payments", requireAuth, async (req, res): Promise<void> => {
  const query = ListPaymentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  if (query.data.studentId == null) {
    if (req.session.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const payments = await db.select().from(paymentsTable).orderBy(paymentsTable.sessionDate);
    res.json(ListPaymentsResponse.parse(payments.map(toPayment)));
    return;
  }
  if (!(await ownsStudent(req, query.data.studentId))) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.studentId, query.data.studentId)).orderBy(paymentsTable.sessionDate);
  res.json(ListPaymentsResponse.parse(payments.map(toPayment)));
});

router.post("/payments", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [payment] = await db.insert(paymentsTable).values({
    ...parsed.data,
    amount: String(parsed.data.amount),
    status: parsed.data.status ?? "pending",
  }).returning();
  res.status(201).json(toPayment(payment));
});

router.post("/payments/send-link", requireAdmin, async (req, res): Promise<void> => {
  const parsed = SendPaymentLinkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const payment = await createAndSendPaymentLink(parsed.data);
    res.status(201).json(toPayment(payment));
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Failed to create payment link" });
  }
});

router.patch("/payments/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdatePaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [payment] = await db.update(paymentsTable).set(parsed.data).where(eq(paymentsTable.id, params.data.id)).returning();
  if (!payment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }
  res.json(UpdatePaymentResponse.parse(toPayment(payment)));
});

router.delete("/payments/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(paymentsTable).where(eq(paymentsTable.id, id));
  res.status(204).send();
});

export default router;
