import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { SignupBody, LoginBody, GetCurrentUserResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@thurrocktuitionacademy.co.uk").toLowerCase();

const toAuthUser = (u: typeof usersTable.$inferSelect) => ({
  id: u.id,
  email: u.email,
  fullName: u.fullName,
  role: u.role,
});

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = SignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const email = parsed.data.email.toLowerCase();

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const role = email === ADMIN_EMAIL ? "admin" : "parent";

  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      passwordHash,
      fullName: parsed.data.fullName,
      role,
    })
    .returning();

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.email = user.email;
  res.status(201).json(GetCurrentUserResponse.parse(toAuthUser(user)));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const email = parsed.data.email.toLowerCase();

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.email = user.email;
  res.json(GetCurrentUserResponse.parse(toAuthUser(user)));
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.clearCookie("tta.sid");
    res.status(204).send();
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(GetCurrentUserResponse.parse(toAuthUser(user)));
});

export default router;
