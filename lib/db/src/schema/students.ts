import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  parentName: text("parent_name").notNull(),
  contactNumber: text("contact_number").notNull(),
  subject: text("subject").notNull(),
  level: text("level").notNull(),
  sessionSlot: text("session_slot").notNull(),
  parentEmail: text("parent_email"),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, joinedAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
