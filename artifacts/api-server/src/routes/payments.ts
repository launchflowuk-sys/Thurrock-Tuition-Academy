import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, paymentsTable } from "@workspace/db";
import {
  CreatePaymentBody,
  ListPaymentsQueryParams,
  ListPaymentsResponse,
  UpdatePaymentBody,
  UpdatePaymentParams,
  UpdatePaymentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toPayment = (p: typeof paymentsTable.$inferSelect) => ({
  ...p,
  amount: Number(p.amount),
  createdAt: p.createdAt.toISOString(),
});

router.get("/payments", async (req, res): Promise<void> => {
  const query = ListPaymentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  let payments;
  if (query.data.studentId != null) {
    payments = await db.select().from(paymentsTable).where(eq(paymentsTable.studentId, query.data.studentId)).orderBy(paymentsTable.sessionDate);
  } else {
    payments = await db.select().from(paymentsTable).orderBy(paymentsTable.sessionDate);
  }
  res.json(ListPaymentsResponse.parse(payments.map(toPayment)));
});

router.post("/payments", async (req, res): Promise<void> => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [payment] = await db.insert(paymentsTable).values({ ...parsed.data, amount: String(parsed.data.amount) }).returning();
  res.status(201).json(toPayment(payment));
});

router.patch("/payments/:id", async (req, res): Promise<void> => {
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

export default router;
