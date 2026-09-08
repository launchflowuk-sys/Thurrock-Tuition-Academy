import { Router, type IRouter } from "express";
import { and, eq, gte, inArray } from "drizzle-orm";
import { db, attendanceTable, sessionsTable, studentsTable } from "@workspace/db";
import {
  ListAttendanceResponse,
  MarkAttendanceBody,
  MarkAttendanceResponse,
  ListStudentsAtRiskResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/authMiddleware";

const router: IRouter = Router();

/** A child who misses two sessions is usually gone within a term. */
const AT_RISK_ABSENCES = 2;
const AT_RISK_WINDOW_WEEKS = 4;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toAttendance = (a: typeof attendanceTable.$inferSelect) => ({
  ...a,
  recordedAt: a.recordedAt.toISOString(),
});

router.get("/attendance", requireAdmin, async (req, res): Promise<void> => {
  const rawSessionId = req.query.sessionId;
  if (rawSessionId !== undefined) {
    const sessionId = Number(rawSessionId);
    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      res.status(400).json({ error: "Invalid sessionId" });
      return;
    }
    const rows = await db
      .select()
      .from(attendanceTable)
      .where(eq(attendanceTable.sessionId, sessionId));
    res.json(ListAttendanceResponse.parse(rows.map(toAttendance)));
    return;
  }
  const rows = await db.select().from(attendanceTable);
  res.json(ListAttendanceResponse.parse(rows.map(toAttendance)));
});

/**
 * Marks the whole register for one session in a single call.
 *
 * Upserts per student: re-marking a session updates the existing row rather
 * than stacking contradictory records, which is what the unique index on
 * (session_id, student_id) enforces at the database level too.
 */
router.put("/attendance", requireAdmin, async (req, res): Promise<void> => {
  const parsed = MarkAttendanceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { sessionId, entries } = parsed.data;

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId))
    .limit(1);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  for (const entry of entries) {
    const [existing] = await db
      .select()
      .from(attendanceTable)
      .where(
        and(
          eq(attendanceTable.sessionId, sessionId),
          eq(attendanceTable.studentId, entry.studentId),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .update(attendanceTable)
        .set({ status: entry.status, notes: entry.notes ?? null, recordedAt: new Date() })
        .where(eq(attendanceTable.id, existing.id));
    } else {
      await db.insert(attendanceTable).values({
        sessionId,
        studentId: entry.studentId,
        status: entry.status,
        notes: entry.notes ?? null,
      });
    }
  }

  const rows = await db
    .select()
    .from(attendanceTable)
    .where(eq(attendanceTable.sessionId, sessionId));
  res.json(MarkAttendanceResponse.parse(rows.map(toAttendance)));
});

/**
 * Students with two or more absences in a rolling four weeks.
 *
 * Returns a per-week attended/missed strip alongside the count, because a
 * pattern of absence is visible at a glance in a way a number never is.
 */
router.get("/attendance/at-risk", requireAdmin, async (_req, res): Promise<void> => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - AT_RISK_WINDOW_WEEKS * 7 * MS_PER_DAY);

  // Session dates are stored as ISO date strings, so filter in JS rather than
  // relying on a text comparison that would break on any format drift.
  const sessions = await db.select().from(sessionsTable);
  const recent = sessions.filter((s) => {
    const d = new Date(s.date);
    return !Number.isNaN(d.getTime()) && d >= windowStart && d <= now;
  });
  if (recent.length === 0) {
    res.json(ListStudentsAtRiskResponse.parse([]));
    return;
  }

  const recentIds = recent.map((s) => s.id);
  const rows = await db
    .select()
    .from(attendanceTable)
    .where(inArray(attendanceTable.sessionId, recentIds));

  const sessionDate = new Map(recent.map((s) => [s.id, new Date(s.date)]));

  // week 0 is the oldest of the four.
  const weekIndex = (d: Date) =>
    Math.min(
      AT_RISK_WINDOW_WEEKS - 1,
      Math.max(0, Math.floor((d.getTime() - windowStart.getTime()) / (7 * MS_PER_DAY))),
    );

  interface Tally {
    absences: number;
    weeks: boolean[];
  }
  const byStudent = new Map<number, Tally>();

  for (const row of rows) {
    const date = sessionDate.get(row.sessionId);
    if (!date) continue;
    const tally =
      byStudent.get(row.studentId) ??
      { absences: 0, weeks: Array<boolean>(AT_RISK_WINDOW_WEEKS).fill(false) };
    // Only a plain absence counts against a student — "late" and "excused"
    // are different conversations.
    if (row.status === "absent") {
      tally.absences += 1;
    } else {
      tally.weeks[weekIndex(date)] = true;
    }
    byStudent.set(row.studentId, tally);
  }

  const atRiskIds = [...byStudent.entries()]
    .filter(([, t]) => t.absences >= AT_RISK_ABSENCES)
    .map(([id]) => id);

  if (atRiskIds.length === 0) {
    res.json(ListStudentsAtRiskResponse.parse([]));
    return;
  }

  const students = await db
    .select()
    .from(studentsTable)
    .where(inArray(studentsTable.id, atRiskIds));

  const result = students.map((student) => {
    const tally = byStudent.get(student.id)!;
    return {
      studentId: student.id,
      name: student.name,
      subject: student.subject,
      level: student.level,
      absences: tally.absences,
      weeks: tally.weeks,
    };
  });

  res.json(ListStudentsAtRiskResponse.parse(result));
});

export default router;
