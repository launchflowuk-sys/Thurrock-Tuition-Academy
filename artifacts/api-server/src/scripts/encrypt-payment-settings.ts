// One-off migration: encrypts any plaintext Square/payment credentials
// already sitting in settingsTable. Safe to re-run — fields already in the
// iv:authTag:ciphertext format are left untouched.
//
// Run manually, after setting SETTINGS_ENCRYPTION_KEY in this environment
// and taking a database backup:
//   pnpm --filter @workspace/api-server run migrate:encrypt-settings
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import { encrypt, isEncrypted } from "../lib/encryption";

const FIELDS = ["paymentApiKey", "paymentAccessToken", "paymentLocationId", "paymentAppId"] as const;

async function main() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length === 0) {
    console.log("No settings row exists yet — nothing to migrate.");
    return;
  }
  const settings = rows[0];

  const updates: Partial<typeof settingsTable.$inferInsert> = {};
  for (const field of FIELDS) {
    const value = settings[field];
    if (!value) {
      console.log(`${field}: empty, skipping`);
      continue;
    }
    if (isEncrypted(value)) {
      console.log(`${field}: already encrypted, skipping`);
      continue;
    }
    updates[field] = encrypt(value);
    console.log(`${field}: encrypting`);
  }

  if (Object.keys(updates).length === 0) {
    console.log("Nothing to migrate.");
    return;
  }

  await db.update(settingsTable).set(updates).where(eq(settingsTable.id, settings.id));
  console.log(`Done — migrated ${Object.keys(updates).length} field(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
