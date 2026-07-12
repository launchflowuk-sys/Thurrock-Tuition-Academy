import { db, settingsTable } from "@workspace/db";
import { decrypt, isEncrypted } from "./encryption";

// Transparent legacy-plaintext fallback: returns the decrypted value once the
// encrypt-payment-settings migration script has run in this environment, or
// the raw value as-is if it hasn't (so the app doesn't hard-crash mid-migration).
function readSecret(value: string | null): string | null {
  if (!value) return null;
  return isEncrypted(value) ? decrypt(value) : value;
}

export async function getOrCreateSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length > 0) return rows[0];
  const [created] = await db.insert(settingsTable).values({}).returning();
  return created;
}

// Square (and future PayPal/Stripe) credentials, decrypted for actual API use.
export async function getDecryptedPaymentSettings() {
  const settings = await getOrCreateSettings();
  return {
    ...settings,
    paymentApiKey: readSecret(settings.paymentApiKey),
    paymentAppId: readSecret(settings.paymentAppId),
    paymentAccessToken: readSecret(settings.paymentAccessToken),
    paymentLocationId: readSecret(settings.paymentLocationId),
  };
}

export { readSecret };
