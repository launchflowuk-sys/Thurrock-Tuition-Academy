import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffTable = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("tutor"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }),
  hoursPerWeek: integer("hours_per_week").default(0),
  notes: text("notes"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staffTable).omit({ id: true, joinedAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staffTable.$inferSelect;
