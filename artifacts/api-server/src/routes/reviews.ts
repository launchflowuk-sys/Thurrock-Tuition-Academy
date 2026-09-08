import { Router, type IRouter } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  CreateReviewBody,
  ListPublicReviewsResponse,
  ListReviewsResponse,
  UpdateReviewBody,
  UpdateReviewResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/authMiddleware";
import { logger } from "../lib/logger";
import {
  GoogleReviewsNotConfigured,
  GoogleReviewsRequestFailed,
  syncGoogleReviews,
} from "../lib/googleReviews";

const router: IRouter = Router();

const toReview = (r: typeof reviewsTable.$inferSelect) => ({
  ...r,
  reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
  createdAt: r.createdAt.toISOString(),
});

const toPublicReview = (r: typeof reviewsTable.$inferSelect) => ({
  id: r.id,
  source: r.source,
  authorName: r.authorName,
  authorPhotoUrl: r.authorPhotoUrl,
  rating: r.rating,
  body: r.body,
  relationship: r.relationship,
  reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
});

// Public: only visible reviews, in the admin's chosen order. No auth — this is
// what the marketing site renders.
router.get("/reviews/public", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.isVisible, true))
    .orderBy(asc(reviewsTable.displayOrder), desc(reviewsTable.reviewedAt));

  const averageRating =
    rows.length > 0
      ? Math.round((rows.reduce((sum, r) => sum + r.rating, 0) / rows.length) * 10) / 10
      : null;

  res.json(
    ListPublicReviewsResponse.parse({
      reviews: rows.map(toPublicReview),
      averageRating,
      total: rows.length,
    }),
  );
});

router.get("/reviews", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(reviewsTable)
    .orderBy(asc(reviewsTable.displayOrder), desc(reviewsTable.createdAt));
  res.json(ListReviewsResponse.parse(rows.map(toReview)));
});

router.post("/reviews", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [row] = await db
    .insert(reviewsTable)
    .values({
      source: "manual",
      authorName: d.authorName,
      rating: d.rating,
      body: d.body,
      relationship: d.relationship ?? null,
      reviewedAt: d.reviewedAt ? new Date(d.reviewedAt) : new Date(),
      isVisible: d.isVisible ?? true,
      displayOrder: d.displayOrder ?? 0,
    })
    .returning();
  res.status(201).json(toReview(row));
});

router.patch("/reviews/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid review id" });
    return;
  }
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id)).limit(1);
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const d = parsed.data;
  const update: Partial<typeof reviewsTable.$inferInsert> = { updatedAt: new Date() };

  // Google's API terms don't permit altering the text, rating or author of a
  // Google review. Only presentation is ours to change on a synced row.
  if (existing.source === "google") {
    if (d.isVisible !== undefined) update.isVisible = d.isVisible;
    if (d.displayOrder !== undefined) update.displayOrder = d.displayOrder;
  } else {
    if (d.authorName !== undefined) update.authorName = d.authorName;
    if (d.rating !== undefined) update.rating = d.rating;
    if (d.body !== undefined) update.body = d.body;
    if (d.relationship !== undefined) update.relationship = d.relationship ?? null;
    if (d.reviewedAt !== undefined) update.reviewedAt = d.reviewedAt ? new Date(d.reviewedAt) : null;
    if (d.isVisible !== undefined) update.isVisible = d.isVisible;
    if (d.displayOrder !== undefined) update.displayOrder = d.displayOrder;
  }

  const [row] = await db
    .update(reviewsTable)
    .set(update)
    .where(eq(reviewsTable.id, id))
    .returning();
  res.json(UpdateReviewResponse.parse(toReview(row)));
});

router.delete("/reviews/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "Invalid review id" });
    return;
  }
  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  res.status(204).send();
});

router.post("/reviews/sync-google", requireAdmin, async (_req, res): Promise<void> => {
  try {
    res.json(await syncGoogleReviews());
  } catch (err) {
    if (err instanceof GoogleReviewsNotConfigured) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof GoogleReviewsRequestFailed) {
      res.status(502).json({ error: err.message });
      return;
    }
    logger.error({ err }, "Google reviews sync failed unexpectedly");
    res.status(500).json({ error: "Sync failed" });
  }
});

export default router;
