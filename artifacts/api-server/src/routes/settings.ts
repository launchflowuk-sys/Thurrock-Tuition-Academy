import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  GetWidgetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
  GetPaymentPublicSettingsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/authMiddleware";
import { encrypt } from "../lib/encryption";
import { getOrCreateSettings, readSecret } from "../lib/paymentSettings";

const router: IRouter = Router();

const MASK = "••••••••";

const toSettings = (s: typeof settingsTable.$inferSelect) => ({
  smtpHost: s.smtpHost,
  smtpPort: s.smtpPort,
  smtpUser: s.smtpUser,
  smtpFrom: s.smtpFrom,
  smtpEnabled: s.smtpEnabled,
  paymentProcessor: s.paymentProcessor,
  paymentApiKey: s.paymentApiKey ? MASK : null,
  paymentAppId: s.paymentAppId ? MASK : null,
  paymentAccessToken: s.paymentAccessToken ? MASK : null,
  // Not treated as a secret in the UI (shown in plain, unlike the fields
  // above) so it must come back decrypted rather than masked.
  paymentLocationId: readSecret(s.paymentLocationId),
  paymentMode: s.paymentMode,
  paymentEnabled: s.paymentEnabled,
  paypalClientId: s.paypalClientId ? MASK : null,
  paypalSecret: s.paypalSecret ? MASK : null,
  stripePublishableKey: s.stripePublishableKey,
  stripeSecretKey: s.stripeSecretKey ? MASK : null,
  bookingWidgetCode: s.bookingWidgetCode,
  bookingWidgetEnabled: s.bookingWidgetEnabled,
  bookingWidgetPlacement: s.bookingWidgetPlacement,
  updatedAt: s.updatedAt.toISOString(),
});

router.get("/settings", requireAdmin, async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(GetSettingsResponse.parse(toSettings(settings)));
});

router.put("/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const settings = await getOrCreateSettings();
  const d = parsed.data;
  const updateData: Partial<typeof settingsTable.$inferInsert> = {
    smtpHost: d.smtpHost ?? settings.smtpHost ?? undefined,
    smtpPort: d.smtpPort ?? settings.smtpPort ?? undefined,
    smtpUser: d.smtpUser ?? settings.smtpUser ?? undefined,
    smtpFrom: d.smtpFrom ?? settings.smtpFrom ?? undefined,
    smtpEnabled: d.smtpEnabled ?? settings.smtpEnabled,
    paymentProcessor: d.paymentProcessor ?? settings.paymentProcessor ?? undefined,
    paymentMode: d.paymentMode ?? settings.paymentMode ?? undefined,
    paymentEnabled: d.paymentEnabled ?? settings.paymentEnabled,
    bookingWidgetCode: d.bookingWidgetCode ?? settings.bookingWidgetCode ?? undefined,
    bookingWidgetEnabled: d.bookingWidgetEnabled ?? settings.bookingWidgetEnabled,
    bookingWidgetPlacement: d.bookingWidgetPlacement ?? settings.bookingWidgetPlacement ?? undefined,
    updatedAt: new Date(),
  };
  if (d.smtpPass && d.smtpPass !== MASK) updateData.smtpPass = d.smtpPass;
  if (d.paymentApiKey && d.paymentApiKey !== MASK) updateData.paymentApiKey = encrypt(d.paymentApiKey);
  if (d.paymentAppId && d.paymentAppId !== MASK) updateData.paymentAppId = encrypt(d.paymentAppId);
  if (d.paymentAccessToken && d.paymentAccessToken !== MASK) updateData.paymentAccessToken = encrypt(d.paymentAccessToken);
  if (d.paymentLocationId !== undefined) updateData.paymentLocationId = d.paymentLocationId ? encrypt(d.paymentLocationId) : null;
  if (d.paypalClientId && d.paypalClientId !== MASK) updateData.paypalClientId = d.paypalClientId;
  if (d.paypalSecret && d.paypalSecret !== MASK) updateData.paypalSecret = d.paypalSecret;
  if (d.stripePublishableKey !== undefined) updateData.stripePublishableKey = d.stripePublishableKey;
  if (d.stripeSecretKey && d.stripeSecretKey !== MASK) updateData.stripeSecretKey = d.stripeSecretKey;

  const [updated] = await db.update(settingsTable).set(updateData).where(eq(settingsTable.id, settings.id)).returning();
  res.json(UpdateSettingsResponse.parse(toSettings(updated)));
});

router.get("/settings/widget", async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(GetWidgetSettingsResponse.parse({
    bookingWidgetCode: settings.bookingWidgetCode,
    bookingWidgetEnabled: settings.bookingWidgetEnabled,
    bookingWidgetPlacement: settings.bookingWidgetPlacement,
  }));
});

router.get("/settings/payment-public", async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(GetPaymentPublicSettingsResponse.parse({
    paymentEnabled: settings.paymentEnabled,
    paymentProcessor: settings.paymentProcessor,
    paymentMode: settings.paymentMode,
    paymentAppId: readSecret(settings.paymentAppId),
    paymentLocationId: readSecret(settings.paymentLocationId),
    paypalClientId: settings.paypalClientId,
    stripePublishableKey: settings.stripePublishableKey,
  }));
});

export default router;
