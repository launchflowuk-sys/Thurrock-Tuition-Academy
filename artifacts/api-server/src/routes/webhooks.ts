import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { WebhooksHelper } from "square";
import { db, paymentsTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { parsePaymentNoteReference } from "../lib/square";

if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
  throw new Error("SQUARE_WEBHOOK_SIGNATURE_KEY must be set.");
}
const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

const router: IRouter = Router();

// Mounted after a route-scoped express.raw() in app.ts (registered before the
// global express.json()), so req.body here is the raw Buffer Square signed —
// required for HMAC signature verification, not a JSON-parsed object.
router.post("/webhooks/square", async (req, res): Promise<void> => {
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : "";
  const signature = req.header("x-square-hmacsha256-signature");

  if (!rawBody || !signature) {
    res.status(400).json({ error: "Missing body or signature" });
    return;
  }

  const notificationUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const isValid = await WebhooksHelper.verifySignature({
    requestBody: rawBody,
    signatureHeader: signature,
    signatureKey: SIGNATURE_KEY,
    notificationUrl,
  }).catch((err) => {
    logger.error({ err }, "Square webhook signature verification threw");
    return false;
  });

  if (!isValid) {
    logger.warn("Square webhook signature verification failed");
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  // Always 200 past this point — Square retries on non-2xx, and a bug in our
  // own lookup logic shouldn't cause it to keep hammering this endpoint.
  res.status(200).json({ received: true });

  try {
    const event = JSON.parse(rawBody);
    if (event.type !== "payment.updated") return;

    const payment = event.data?.object?.payment;
    if (!payment || payment.status !== "COMPLETED") return;

    const paymentRowId = parsePaymentNoteReference(payment.note);
    if (paymentRowId == null) {
      logger.warn({ squarePaymentId: payment.id }, "Square webhook payment had no matching internal reference note");
      return;
    }

    await db
      .update(paymentsTable)
      .set({ status: "paid", squarePaymentId: payment.id })
      .where(eq(paymentsTable.id, paymentRowId));

    logger.info({ paymentRowId, squarePaymentId: payment.id }, "Payment marked paid via Square webhook");
  } catch (err) {
    logger.error({ err }, "Failed to process Square webhook payload");
  }
});

export default router;
