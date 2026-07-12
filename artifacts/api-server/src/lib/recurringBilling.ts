import { db, paymentsTable } from "@workspace/db";
import { createAndSendPaymentLink } from "./square";
import { logger } from "./logger";

type PaymentRow = typeof paymentsTable.$inferSelect;

export interface RecurringBillingResult {
  studentId: number;
  status: "sent" | "skipped" | "error";
  error?: string;
}

// Runs daily. A student is billed this cycle only if their most recent
// payment row (regardless of status) has isRecurring=true and billingDay
// equal to today — so turning isRecurring off on that latest row (via the
// normal PATCH /payments/:id endpoint) genuinely stops future billing,
// even though older rows for the same student are still isRecurring=true.
export async function runRecurringBilling(referenceDate: Date = new Date()): Promise<RecurringBillingResult[]> {
  const today = referenceDate.getDate();
  const monthStart = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);

  const allPayments = await db.select().from(paymentsTable);

  const latestByStudent = new Map<number, PaymentRow>();
  for (const row of allPayments) {
    const current = latestByStudent.get(row.studentId);
    if (!current || row.createdAt > current.createdAt) {
      latestByStudent.set(row.studentId, row);
    }
  }

  const dueToday = [...latestByStudent.values()].filter(
    (row) => row.isRecurring && row.billingDay === today,
  );

  const results: RecurringBillingResult[] = [];

  for (const template of dueToday) {
    const alreadyBilledThisMonth = allPayments.some(
      (row) => row.studentId === template.studentId && row.isRecurring && row.createdAt >= monthStart,
    );
    if (alreadyBilledThisMonth) {
      results.push({ studentId: template.studentId, status: "skipped" });
      continue;
    }

    try {
      await createAndSendPaymentLink({
        studentId: template.studentId,
        amount: Number(template.amount),
        description: template.notes ?? "Monthly tuition",
        isRecurring: true,
        billingDay: template.billingDay,
      });
      results.push({ studentId: template.studentId, status: "sent" });
    } catch (err) {
      logger.error({ err, studentId: template.studentId }, "Recurring billing failed for student");
      results.push({
        studentId: template.studentId,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
