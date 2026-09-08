import { pgTable, serial, integer, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

/**
 * Session attendance — one row per student per session.
 *
 * This is the data the dashboard's most valuable figures depend on: weekly
 * attendance, and students at risk. A child who misses two sessions is usually
 * gone within a term, so the register is the earliest warning the academy gets.
 *
 * Statuses are deliberately four, not two: "late" and "excused" are different
 * conversations from "absent", and collapsing them loses the distinction that
 * makes the at-risk count trustworthy. Only "absent" counts against a student.
 */
export const attendanceTable = pgTable(
  "session_attendance",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id").notNull(),
    studentId: integer("student_id").notNull(),
    // "present" | "absent" | "late" | "excused"
    status: text("status").notNull().default("present"),
    notes: text("notes"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // A student can only be marked once per session — re-marking updates the
    // existing row rather than stacking contradictory records.
    uniqueIndex("attendance_session_student_key").on(table.sessionId, table.studentId),
  ],
);

export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({
  id: true,
  recordedAt: true,
});

export type Attendance = typeof attendanceTable.$inferSelect;
