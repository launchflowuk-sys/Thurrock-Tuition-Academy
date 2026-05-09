import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const progressNotesTable = pgTable("progress_notes", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  content: text("content").notNull(),
  subject: text("subject").notNull(),
  sessionDate: text("session_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProgressNoteSchema = createInsertSchema(progressNotesTable).omit({ id: true, createdAt: true });
export type InsertProgressNote = z.infer<typeof insertProgressNoteSchema>;
export type ProgressNote = typeof progressNotesTable.$inferSelect;
