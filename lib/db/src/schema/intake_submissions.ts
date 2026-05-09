import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const intakeSubmissionsTable = pgTable("intake_submissions", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  childName: text("child_name").notNull(),
  childAge: integer("child_age").notNull(),
  email: text("email").notNull(),
  contactNumber: text("contact_number").notNull(),
  subject: text("subject").notNull(),
  level: text("level").notNull(),
  currentSchool: text("current_school"),
  additionalInfo: text("additional_info"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertIntakeSubmissionSchema = createInsertSchema(intakeSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertIntakeSubmission = z.infer<typeof insertIntakeSubmissionSchema>;
export type IntakeSubmission = typeof intakeSubmissionsTable.$inferSelect;
