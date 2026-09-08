// Creates (or promotes) an admin login. Public signup deliberately always
// assigns role "parent" — see artifacts/api-server/src/routes/auth.ts — so a
// fresh database has no admin and no in-app way to make one. This is that way.
//
//   pnpm --filter @workspace/db run create-admin <email> <password> "<full name>"
//
// If the email already exists, its role is set to "admin" and the password is
// left alone (use the in-app change-password flow instead).
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool, usersTable } from "../index";

const MIN_PASSWORD_LENGTH = 12;

async function main(): Promise<void> {
  // pnpm 11 forwards the `--` separator through to argv, older versions strip
  // it — drop it here so both invocation styles work.
  const argv = process.argv.slice(2).filter((a, i) => !(i === 0 && a === "--"));
  const [rawEmail, password, ...nameParts] = argv;
  const fullName = nameParts.join(" ").trim();

  if (!rawEmail || !password) {
    throw new Error(
      'Usage: pnpm --filter @workspace/db run create-admin <email> <password> "<full name>"',
    );
  }

  const email = rawEmail.trim().toLowerCase();
  if (!email.includes("@")) {
    throw new Error(`"${rawEmail}" does not look like an email address.`);
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (existing.length > 0) {
    if (existing[0].role === "admin") {
      console.log(`${email} is already an admin — nothing to do.`);
      return;
    }
    await db.update(usersTable).set({ role: "admin" }).where(eq(usersTable.id, existing[0].id));
    console.log(`Promoted existing user ${email} to admin.`);
    return;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (!fullName) {
    throw new Error("A full name is required when creating a new admin.");
  }

  // Cost 12 to match routes/auth.ts.
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordHash, fullName, role: "admin" })
    .returning();

  console.log(`Created admin ${user.email} (id ${user.id}).`);
}

main()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error(err instanceof Error ? err.message : err);
    await pool.end().catch(() => {});
    process.exit(1);
  });
