import { Router, type IRouter } from "express";
import { desc, eq, count } from "drizzle-orm";
import { db, enquiriesTable, studentsTable, sessionsTable, progressNotesTable, tasksTable, paymentsTable, intakeSubmissionsTable } from "@workspace/db";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityResponse,
  GetSessionAvailabilityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [totalStudentsResult] = await db.select({ count: count() }).from(studentsTable);
  const [pendingEnquiriesResult] = await db.select({ count: count() }).from(enquiriesTable).where(eq(enquiriesTable.status, "pending"));

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

  const recentEnquiries = await db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt)).limit(5);

  const summary = {
    totalStudents: Number(totalStudentsResult?.count ?? 0),
    pendingEnquiries: Number(pendingEnquiriesResult?.count ?? 0),
    sessionsThisWeek,
    outstandingPayments: Number(outstandingResult?.count ?? 0),
    newIntakeSubmissions: Number(intakeResult?.count ?? 0),
    recentEnquiries: recentEnquiries.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })),
  };

  res.json(GetDashboardSummaryResponse.parse(summary));
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  const enquiries = await db.select().from(enquiriesTable).orderBy(desc(enquiriesTable.createdAt)).limit(5);
  const notes = await db.select().from(progressNotesTable).orderBy(desc(progressNotesTable.createdAt)).limit(5);
  const tasks = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt)).limit(5);

  const activities = [
    ...enquiries.map(e => ({
      id: e.id,
      type: "enquiry",
      description: `New enquiry from ${e.parentName} for ${e.childName}`,
      timestamp: e.createdAt.toISOString(),
    })),
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

router.get("/dashboard/session-availability", async (_req, res): Promise<void> => {
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
