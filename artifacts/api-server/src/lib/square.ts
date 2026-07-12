import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { SquareClient, SquareEnvironment } from "square";
import { db, paymentsTable, studentsTable } from "@workspace/db";
import { getDecryptedPaymentSettings } from "./paymentSettings";
import { sendPaymentLinkEmail } from "./email";

export class SquareNotConfiguredError extends Error {}

async function getSquareClient() {
  const settings = await getDecryptedPaymentSettings();
  if (!settings.paymentEnabled || settings.paymentProcessor !== "square" || !settings.paymentAccessToken) {
    throw new SquareNotConfiguredError("Square is not configured — enable payments and add Square credentials in Settings.");
  }
  if (!settings.paymentLocationId) {
    throw new SquareNotConfiguredError("Square location ID is not configured in Settings.");
  }
  const client = new SquareClient({
    token: settings.paymentAccessToken,
    environment: settings.paymentMode === "live" ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  });
  return { client, locationId: settings.paymentLocationId };
}

export interface CreateAndSendPaymentLinkInput {
  studentId: number;
  amount: number;
  description: string;
  isRecurring?: boolean;
  billingDay?: number | null;
}

// Used by both the manual "Send payment link" admin action and the recurring
// monthly cron job, so the Square + email logic only lives in one place.
export async function createAndSendPaymentLink(input: CreateAndSendPaymentLinkInput) {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, input.studentId));
  if (!student) {
    throw new Error(`Student ${input.studentId} not found`);
  }
  if (!student.parentEmail) {
    throw new Error(`Student ${input.studentId} has no parent email on file`);
  }

  const { client, locationId } = await getSquareClient();

  // Create the payment row before calling Square so we have an internal ID
  // to stamp on the link's paymentNote — Square echoes that note back onto
  // the resulting Payment object, which is how the webhook correlates a
  // completed charge back to this row.
  const [payment] = await db
    .insert(paymentsTable)
    .values({
      studentId: input.studentId,
      sessionDate: new Date().toISOString().slice(0, 10),
      amount: String(input.amount),
      status: "link_sent",
      notes: input.description,
      isRecurring: input.isRecurring ?? false,
      billingDay: input.billingDay ?? null,
    })
    .returning();

  let response;
  try {
    response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      description: input.description,
      paymentNote: `tta:${payment.id}`,
      quickPay: {
        name: input.description,
        priceMoney: { amount: BigInt(Math.round(input.amount * 100)), currency: "GBP" },
        locationId,
      },
    });
  } catch (err) {
    await db.delete(paymentsTable).where(eq(paymentsTable.id, payment.id));
    throw err;
  }

  if (!response.paymentLink?.url) {
    await db.delete(paymentsTable).where(eq(paymentsTable.id, payment.id));
    throw new Error("Square did not return a payment link URL.");
  }

  const [updated] = await db
    .update(paymentsTable)
    .set({
      paymentLinkId: response.paymentLink.id ?? null,
      paymentLinkUrl: response.paymentLink.url,
      sentAt: new Date(),
    })
    .where(eq(paymentsTable.id, payment.id))
    .returning();

  await sendPaymentLinkEmail({
    to: student.parentEmail,
    parentName: student.parentName,
    studentName: student.name,
    amount: input.amount,
    description: input.description,
    paymentUrl: response.paymentLink.url,
  });

  return updated;
}

// Parses the `tta:<paymentId>` note the webhook handler needs to correlate a
// completed Square payment back to our internal payments row.
export function parsePaymentNoteReference(note: string | null | undefined): number | null {
  if (!note) return null;
  const match = /^tta:(\d+)$/.exec(note.trim());
  return match ? Number(match[1]) : null;
}
