import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { SignupBody, LoginBody, ChangePasswordBody, ChangePasswordResponse, GetCurrentUserResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/authMiddleware";

const router: IRouter = Router();

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

  // Public signup can never grant admin — admin accounts are created
  // directly in the database (or via a future invite system), not here.
  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      passwordHash,
      fullName: parsed.data.fullName,
      role: "parent",
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

router.post("/auth/change-password", requireAuth, async (req, res): Promise<void> => {
  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, user.id));

  const { userId, role, email } = req.session;
  req.session.regenerate((err) => {
    if (err) {
      res.status(500).json({ error: "Failed to refresh session" });
      return;
    }
    req.session.userId = userId;
    req.session.role = role;
    req.session.email = email;
    req.session.save((saveErr) => {
      if (saveErr) {
        res.status(500).json({ error: "Failed to refresh session" });
        return;
      }
      res.json(ChangePasswordResponse.parse({ success: true }));
    });
  });
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
