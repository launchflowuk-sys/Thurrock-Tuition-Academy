import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { studentsTable } from "./students";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  senderRole: text("sender_role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

export type Message = typeof messagesTable.$inferSelect;
