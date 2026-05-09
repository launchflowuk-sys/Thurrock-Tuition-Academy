import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  GetWidgetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({}).returning();
  return created;
}

const toSettings = (s: typeof settingsTable.$inferSelect) => ({
  smtpHost: s.smtpHost,
  smtpPort: s.smtpPort,
  smtpUser: s.smtpUser,
  smtpFrom: s.smtpFrom,
  smtpEnabled: s.smtpEnabled,
  paymentProcessor: s.paymentProcessor,
  paymentApiKey: s.paymentApiKey ? "••••••••" : null,
  paymentLocationId: s.paymentLocationId,
  paymentMode: s.paymentMode,
  paymentEnabled: s.paymentEnabled,
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
  const updateData: Partial<typeof settingsTable.$inferInsert> = {
    smtpHost: parsed.data.smtpHost ?? settings.smtpHost ?? undefined,
    smtpPort: parsed.data.smtpPort ?? settings.smtpPort ?? undefined,
    smtpUser: parsed.data.smtpUser ?? settings.smtpUser ?? undefined,
    smtpFrom: parsed.data.smtpFrom ?? settings.smtpFrom ?? undefined,
    smtpEnabled: parsed.data.smtpEnabled ?? settings.smtpEnabled,
    paymentProcessor: parsed.data.paymentProcessor ?? settings.paymentProcessor ?? undefined,
    paymentLocationId: parsed.data.paymentLocationId ?? settings.paymentLocationId ?? undefined,
    paymentMode: parsed.data.paymentMode ?? settings.paymentMode ?? undefined,
    paymentEnabled: parsed.data.paymentEnabled ?? settings.paymentEnabled,
    bookingWidgetCode: parsed.data.bookingWidgetCode ?? settings.bookingWidgetCode ?? undefined,
    bookingWidgetEnabled: parsed.data.bookingWidgetEnabled ?? settings.bookingWidgetEnabled,
    bookingWidgetPlacement: parsed.data.bookingWidgetPlacement ?? settings.bookingWidgetPlacement ?? undefined,
    updatedAt: new Date(),
  };
  if (parsed.data.smtpPass && parsed.data.smtpPass !== "••••••••") {
    updateData.smtpPass = parsed.data.smtpPass;
  }
  if (parsed.data.paymentApiKey && parsed.data.paymentApiKey !== "••••••••") {
    updateData.paymentApiKey = parsed.data.paymentApiKey;
  }
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

export default router;
