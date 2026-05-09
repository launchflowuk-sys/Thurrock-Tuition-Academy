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

const router: IRouter = Router();

async function getOrCreateSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({}).returning();
  return created;
}

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
  paymentLocationId: s.paymentLocationId,
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

router.get("/settings", async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(GetSettingsResponse.parse(toSettings(settings)));
});

router.put("/settings", async (req, res): Promise<void> => {
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
    paymentLocationId: d.paymentLocationId ?? settings.paymentLocationId ?? undefined,
    paymentMode: d.paymentMode ?? settings.paymentMode ?? undefined,
    paymentEnabled: d.paymentEnabled ?? settings.paymentEnabled,
    bookingWidgetCode: d.bookingWidgetCode ?? settings.bookingWidgetCode ?? undefined,
    bookingWidgetEnabled: d.bookingWidgetEnabled ?? settings.bookingWidgetEnabled,
    bookingWidgetPlacement: d.bookingWidgetPlacement ?? settings.bookingWidgetPlacement ?? undefined,
    updatedAt: new Date(),
  };
  if (d.smtpPass && d.smtpPass !== MASK) updateData.smtpPass = d.smtpPass;
  if (d.paymentApiKey && d.paymentApiKey !== MASK) updateData.paymentApiKey = d.paymentApiKey;
  if (d.paymentAppId && d.paymentAppId !== MASK) updateData.paymentAppId = d.paymentAppId;
  if (d.paymentAccessToken && d.paymentAccessToken !== MASK) updateData.paymentAccessToken = d.paymentAccessToken;
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
    paymentAppId: settings.paymentAppId,
    paymentLocationId: settings.paymentLocationId,
    paypalClientId: settings.paypalClientId,
    stripePublishableKey: settings.stripePublishableKey,
  }));
});

export default router;
