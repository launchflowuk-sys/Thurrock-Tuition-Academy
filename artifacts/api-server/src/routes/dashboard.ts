import { Router, type IRouter } from "express";
import { desc, eq, count, gte, inArray } from "drizzle-orm";
import { db, studentsTable, sessionsTable, progressNotesTable, tasksTable, paymentsTable, intakeSubmissionsTable, staffTable, attendanceTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityResponse,
  GetSessionAvailabilityResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/authMiddleware";

const router: IRouter = Router();

router.get("/dashboard/summary", requireAdmin, async (_req, res): Promise<void> => {
  const [totalStudentsResult] = await db.select({ count: count() }).from(studentsTable);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const allSessions = await db.select().from(sessionsTable);
  const sessionsThisWeek = allSessions.filter(s => {
    const d = new Date(s.date);
    return d >= startOfWeek && d < endOfWeek;
  }).length;

  const [outstandingResult] = await db.select({ count: count() }).from(paymentsTable).where(eq(paymentsTable.status, "pending"));
  const [intakeResult] = await db.select({ count: count() }).from(intakeSubmissionsTable).where(eq(intakeSubmissionsTable.status, "new"));

  // "N starting this month" — the figure that gives the headline student count
  // its direction of travel.
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startedThisMonthResult] = await db
    .select({ count: count() })
    .from(studentsTable)
    .where(gte(studentsTable.joinedAt, startOfMonth));

  // Applications that were answered but never resolved — where enrolment
  // revenue leaks. "new" is counted separately as newIntakeSubmissions.
  //
  // This counted status "contacted", which is not one of the four statuses the
  // app ever writes (new | reviewing | enrolled | declined). The count was
  // therefore always 0, so the dashboard read "All followed up" while new
  // applications sat unanswered. "reviewing" is the real answered-not-resolved
  // state.
  const [awaitingFollowUpResult] = await db
    .select({ count: count() })
    .from(intakeSubmissionsTable)
    .where(eq(intakeSubmissionsTable.status, "reviewing"));

  // Safeguarding: an enhanced DBS falling due inside 60 days needs action now,
  // and a tutor with no DBS recorded at all is a separate, worse problem.
  // Dates are stored as ISO date strings, so compare lexically via Date.
  const DBS_WARNING_DAYS = 60;
  const dbsHorizon = new Date(now.getTime() + DBS_WARNING_DAYS * 24 * 60 * 60 * 1000);
  const allStaff = await db.select().from(staffTable);
  let dbsExpiringSoon = 0;
  let dbsNotRecorded = 0;
  for (const member of allStaff) {
    if (!member.dbsExpiryDate) {
      dbsNotRecorded += 1;
      continue;
    }
    const expiry = new Date(member.dbsExpiryDate);
    if (Number.isNaN(expiry.getTime())) {
      dbsNotRecorded += 1;
      continue;
    }
    // Already expired counts as expiring — it is the more urgent case.
    if (expiry <= dbsHorizon) dbsExpiringSoon += 1;
  }

  // Attendance this week — the single best predictor of a student leaving.
  // Percentage of marked places that were actually attended; "late" counts as
  // attended, "excused" is excluded from both sides so an authorised absence
  // doesn't punish the figure.
  const weekSessionIds = allSessions
    .filter((s) => {
      const d = new Date(s.date);
      return !Number.isNaN(d.getTime()) && d >= startOfWeek && d < endOfWeek;
    })
    .map((s) => s.id);

  let attendanceThisWeek: number | null = null;
  if (weekSessionIds.length > 0) {
    const marks = await db
      .select()
      .from(attendanceTable)
      .where(inArray(attendanceTable.sessionId, weekSessionIds));
    const counted = marks.filter((m) => m.status !== "excused");
    attendanceThisWeek =
      counted.length > 0
        ? Math.round((counted.filter((m) => m.status !== "absent").length / counted.length) * 100)
        : null;
  }

  // Students at risk: two or more absences in a rolling four weeks.
  const riskWindowStart = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const riskSessionIds = allSessions
    .filter((s) => {
      const d = new Date(s.date);
      return !Number.isNaN(d.getTime()) && d >= riskWindowStart && d <= now;
    })
    .map((s) => s.id);
  let studentsAtRisk = 0;
  if (riskSessionIds.length > 0) {
    const marks = await db
      .select()
      .from(attendanceTable)
      .where(inArray(attendanceTable.sessionId, riskSessionIds));
    const absences = new Map<number, number>();
    for (const m of marks) {
      if (m.status === "absent") {
        absences.set(m.studentId, (absences.get(m.studentId) ?? 0) + 1);
      }
    }
    studentsAtRisk = [...absences.values()].filter((n) => n >= 2).length;
  }

  // A session on the timetable with nobody against it.
  const unassignedSessions = allSessions.filter(
    (s) => s.staffId == null && new Date(s.date) >= startOfWeek,
  ).length;

  const summary = {
    totalStudents: Number(totalStudentsResult?.count ?? 0),
    sessionsThisWeek,
    outstandingPayments: Number(outstandingResult?.count ?? 0),
    newIntakeSubmissions: Number(intakeResult?.count ?? 0),
    studentsStartedThisMonth: Number(startedThisMonthResult?.count ?? 0),
    applicationsAwaitingFollowUp: Number(awaitingFollowUpResult?.count ?? 0),
    dbsExpiringSoon,
    dbsNotRecorded,
    attendanceThisWeek,
    studentsAtRisk,
    unassignedSessions,
  };

  res.json(GetDashboardSummaryResponse.parse(summary));
});

router.get("/dashboard/recent-activity", requireAdmin, async (_req, res): Promise<void> => {
  const notes = await db.select().from(progressNotesTable).orderBy(desc(progressNotesTable.createdAt)).limit(5);
  const tasks = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt)).limit(5);

  const activities = [
    ...notes.map(n => ({
      id: n.id + 10000,
      type: "progress",
      description: `Progress note added for student #${n.studentId}`,
      timestamp: n.createdAt.toISOString(),
    })),
    ...tasks.map(t => ({
      id: t.id + 20000,
      type: "task",
      description: `Task assigned: ${t.title}`,
      timestamp: t.createdAt.toISOString(),
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  res.json(GetRecentActivityResponse.parse(activities));
});

router.get("/dashboard/session-availability", requireAdmin, async (_req, res): Promise<void> => {
  const SLOTS = [
    { slotLabel: "Morning Session 1", startTime: "09:00", endTime: "11:00", capacity: 8 },
    { slotLabel: "Morning Session 2", startTime: "11:00", endTime: "13:00", capacity: 8 },
    { slotLabel: "Afternoon Session 1", startTime: "13:00", endTime: "15:00", capacity: 8 },
    { slotLabel: "Afternoon Session 2", startTime: "15:00", endTime: "17:00", capacity: 8 },
  ];

  const students = await db.select({ sessionSlot: studentsTable.sessionSlot }).from(studentsTable);

  const slotCounts: Record<string, number> = {};
  for (const s of students) {
    slotCounts[s.sessionSlot] = (slotCounts[s.sessionSlot] ?? 0) + 1;
  }

  const availability = SLOTS.map(slot => ({
    ...slot,
    enrolled: slotCounts[slot.slotLabel] ?? 0,
    available: (slotCounts[slot.slotLabel] ?? 0) < slot.capacity,
  }));

  res.json(GetSessionAvailabilityResponse.parse(availability));
});

export default router;
