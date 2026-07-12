import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Encrypts secrets at rest in settingsTable (Square/PayPal/Stripe credentials).
// Key must be a base64-encoded 32-byte value, e.g. generated with:
//   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
if (!process.env.SETTINGS_ENCRYPTION_KEY) {
  throw new Error("SETTINGS_ENCRYPTION_KEY must be set.");
}

const KEY = Buffer.from(process.env.SETTINGS_ENCRYPTION_KEY, "base64");
if (KEY.length !== 32) {
  throw new Error("SETTINGS_ENCRYPTION_KEY must decode to exactly 32 bytes (base64-encoded).");
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), ciphertext.toString("base64")].join(":");
}

export function decrypt(stored: string): string {
  const parts = stored.split(":");
  if (parts.length !== 3) {
    throw new Error("Value is not in the expected iv:authTag:ciphertext encrypted format.");
  }
  const [ivB64, authTagB64, ciphertextB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

// True if the value is already in our iv:authTag:ciphertext format (base64
// triplet), as opposed to a plaintext legacy value that still needs migrating.
export function isEncrypted(value: string): boolean {
  const parts = value.split(":");
  if (parts.length !== 3) return false;
  return parts.every((p) => /^[A-Za-z0-9+/]+=*$/.test(p) && p.length > 0);
}
