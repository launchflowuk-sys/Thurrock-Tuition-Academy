import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

/**
 * Parent reviews shown on the public site.
 *
 * Two sources share one table so the public section can render a single sorted
 * list without caring where a review came from:
 *
 *  - "manual"  — typed in by an admin on /reviews.
 *  - "google"  — pulled from the academy's Google Business Profile listing by
 *                the sync job. Google's terms don't allow editing the text of
 *                a Google review, so synced rows are read-only apart from
 *                `isVisible` and `displayOrder`.
 *
 * Synced rows are matched on `googleReviewId` so a re-sync updates in place
 * rather than duplicating, and an admin's decision to hide one survives it.
 */
export const reviewsTable = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    // "manual" | "google"
    source: text("source").notNull().default("manual"),
    authorName: text("author_name").notNull(),
    // Optional: Google supplies one, manual reviews usually won't.
    authorPhotoUrl: text("author_photo_url"),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    // Free text shown under the name, e.g. "Parent of GCSE student".
    relationship: text("relationship"),
    // When the parent left the review, not when we stored it.
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    // Google's stable per-review id; null for manual reviews.
    googleReviewId: text("google_review_id"),
    // Admin controls which reviews appear publicly and in what order.
    isVisible: boolean("is_visible").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Partial-unique isn't expressible here; the sync does a lookup-then-write
    // instead. This index keeps that lookup cheap and catches double-inserts.
    uniqueIndex("reviews_google_review_id_key").on(table.googleReviewId),
  ],
);

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Review = typeof reviewsTable.$inferSelect;
