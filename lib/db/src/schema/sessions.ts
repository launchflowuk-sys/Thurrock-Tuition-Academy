import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  slotLabel: text("slot_label").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  capacity: integer("capacity").notNull().default(8),
  studentIds: integer("student_ids").array().notNull().default([]),
  // The tutor taking the session. Null means unassigned, which the dashboard
  // surfaces as an amber attention figure — a session on the timetable with
  // nobody against it is the thing that quietly fails on the day.
  staffId: integer("staff_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, createdAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
