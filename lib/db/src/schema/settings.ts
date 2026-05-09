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
  paymentAppId: text("payment_app_id"),
  paymentAccessToken: text("payment_access_token"),
  paymentLocationId: text("payment_location_id"),
  paymentMode: text("payment_mode").default("sandbox"),
  paymentEnabled: boolean("payment_enabled").notNull().default(false),
  paypalClientId: text("paypal_client_id"),
  paypalSecret: text("paypal_secret"),
  stripePublishableKey: text("stripe_publishable_key"),
  stripeSecretKey: text("stripe_secret_key"),
  bookingWidgetCode: text("booking_widget_code"),
  bookingWidgetEnabled: boolean("booking_widget_enabled").notNull().default(false),
  bookingWidgetPlacement: text("booking_widget_placement").default("contact"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Settings = typeof settingsTable.$inferSelect;
