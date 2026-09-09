import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const intakeSubmissionsTable = pgTable("intake_submissions", {
  id: serial("id").primaryKey(),

  // --- The child being taught -------------------------------------------
  childName: text("child_name").notNull(),
  childAge: integer("child_age").notNull(),
  childYearGroup: text("child_year_group"),
  currentSchool: text("current_school"),
  subject: text("subject").notNull(),
  level: text("level").notNull(),
  currentAttainment: text("current_attainment"),
  senNotes: text("sen_notes"),

  // --- The parent or guardian who applied -------------------------------
  parentName: text("parent_name").notNull(),
  relationshipToChild: text("relationship_to_child"),
  email: text("email").notNull(),
  contactNumber: text("contact_number").notNull(),
  altContactNumber: text("alt_contact_number"),
  preferredContactMethod: text("preferred_contact_method"),

  // --- Goals, background and admin --------------------------------------
  goals: text("goals"),
  previousTutoring: text("previous_tutoring"),
  howDidYouHear: text("how_did_you_hear"),
  preferredSlot: text("preferred_slot"),
  additionalInfo: text("additional_info"),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
  status: text("status").notNull().default("new"),

  // Set once an application has been promoted into the students table, so the
  // same child cannot be enrolled twice by two clicks of the same button.
  convertedStudentId: integer("converted_student_id"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertIntakeSubmissionSchema = createInsertSchema(intakeSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertIntakeSubmission = z.infer<typeof insertIntakeSubmissionSchema>;
export type IntakeSubmission = typeof intakeSubmissionsTable.$inferSelect;
