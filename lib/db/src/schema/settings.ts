import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port").default(587),
  smtpUser: text("smtp_user"),
  smtpPass: text("smtp_pass"),
  smtpFrom: text("smtp_from"),
  smtpEnabled: boolean("smtp_enabled").notNull().default(false),
  paymentProcessor: text("payment_processor").default("none"),
  paymentApiKey: text("payment_api_key"),
  paymentLocationId: text("payment_location_id"),
  paymentMode: text("payment_mode").default("sandbox"),
  paymentEnabled: boolean("payment_enabled").notNull().default(false),
  bookingWidgetCode: text("booking_widget_code"),
  bookingWidgetEnabled: boolean("booking_widget_enabled").notNull().default(false),
  bookingWidgetPlacement: text("booking_widget_placement").default("contact"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Settings = typeof settingsTable.$inferSelect;
