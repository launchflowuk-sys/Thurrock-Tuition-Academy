import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (req.session.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

export async function ownsStudent(req: Request, studentId: number): Promise<boolean> {
  if (req.session.role === "admin") return true;
  const email = req.session.email?.toLowerCase();
  if (!email) return false;
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  return !!student && !!student.parentEmail && student.parentEmail.toLowerCase() === email;
}
