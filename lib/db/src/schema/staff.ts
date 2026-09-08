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
  // Safeguarding. A tutor working unsupervised with under-18s needs a valid
  // enhanced DBS; the dashboard turns a card coral when one falls due inside
  // 60 days. Nullable because existing rows predate this field — a null reads
  // as "not recorded", which the dashboard counts separately from "expiring".
  dbsCertificateNumber: text("dbs_certificate_number"),
  dbsExpiryDate: text("dbs_expiry_date"),
  notes: text("notes"),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staffTable).omit({ id: true, joinedAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staffTable.$inferSelect;
