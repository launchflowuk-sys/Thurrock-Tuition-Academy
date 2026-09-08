import { eq } from "drizzle-orm";
import { db, reviewsTable, settingsTable } from "@workspace/db";
import { getDecryptedPaymentSettings, getOrCreateSettings } from "./paymentSettings";
import { logger } from "./logger";

/**
 * Pulls parent reviews from the academy's Google Business Profile listing.
 *
 * Uses the Places API (New) `places.get` endpoint, which returns up to five
 * reviews for a place — that is Google's cap, not ours, and there is no paging
 * for it. Anything beyond those five has to be entered manually.
 *
 * Reviews are matched on Google's own review name (a stable per-review id), so
 * re-syncing updates rows in place. An admin hiding a Google review survives a
 * later sync because `isVisible` and `displayOrder` are never overwritten.
 *
 * Google's API terms do not allow altering the text or author of a Google
 * review, so the admin UI keeps synced rows read-only apart from visibility
 * and ordering.
 */

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const FIELD_MASK = "reviews,rating,userRatingCount";

export class GoogleReviewsNotConfigured extends Error {
  constructor(detail: string) {
    super(detail);
    this.name = "GoogleReviewsNotConfigured";
  }
}

export class GoogleReviewsRequestFailed extends Error {
  readonly status: number;
  constructor(status: number, detail: string) {
    super(detail);
    this.name = "GoogleReviewsRequestFailed";
    this.status = status;
  }
}

interface GooglePlaceReview {
  name?: string;
  rating?: number;
  originalText?: { text?: string };
  text?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
  publishTime?: string;
}

interface GooglePlaceResponse {
  reviews?: GooglePlaceReview[];
  error?: { message?: string };
}

export interface SyncResult {
  imported: number;
  updated: number;
  total: number;
  syncedAt: string;
}

export async function syncGoogleReviews(): Promise<SyncResult> {
  const settings = await getDecryptedPaymentSettings();

  if (!settings.googleReviewsEnabled) {
    throw new GoogleReviewsNotConfigured("Google reviews are turned off in settings.");
  }
  const placeId = settings.googlePlaceId?.trim();
  const apiKey = settings.googleApiKey?.trim();
  if (!placeId) {
    throw new GoogleReviewsNotConfigured("No Google Place ID has been saved in settings.");
  }
  if (!apiKey) {
    throw new GoogleReviewsNotConfigured("No Google API key has been saved in settings.");
  }

  // The key goes in a header, never the query string — a key in a URL ends up
  // in proxy and server logs.
  const response = await fetch(`${PLACES_ENDPOINT}/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as GooglePlaceResponse;

  if (!response.ok) {
    const detail = payload.error?.message ?? `Google returned HTTP ${response.status}`;
    logger.error({ status: response.status, detail }, "Google Places request failed");
    throw new GoogleReviewsRequestFailed(response.status, detail);
  }

  const incoming = payload.reviews ?? [];
  let imported = 0;
  let updated = 0;

  for (const review of incoming) {
    const googleReviewId = review.name;
    const body = review.originalText?.text ?? review.text?.text ?? "";
    const authorName = review.authorAttribution?.displayName ?? "Google reviewer";
    const rating = review.rating;

    // A review with no id, no body or no rating can't be stored meaningfully.
    if (!googleReviewId || !body.trim() || typeof rating !== "number") {
      logger.warn({ googleReviewId }, "Skipping incomplete Google review");
      continue;
    }

    const [existing] = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.googleReviewId, googleReviewId))
      .limit(1);

    const reviewedAt = review.publishTime ? new Date(review.publishTime) : null;

    if (existing) {
      // Deliberately does NOT touch isVisible or displayOrder: those are the
      // admin's decisions and must survive a re-sync.
      await db
        .update(reviewsTable)
        .set({
          authorName,
          authorPhotoUrl: review.authorAttribution?.photoUri ?? null,
          rating,
          body,
          reviewedAt,
          updatedAt: new Date(),
        })
        .where(eq(reviewsTable.id, existing.id));
      updated += 1;
      continue;
    }

    await db.insert(reviewsTable).values({
      source: "google",
      googleReviewId,
      authorName,
      authorPhotoUrl: review.authorAttribution?.photoUri ?? null,
      rating,
      body,
      relationship: "Google review",
      reviewedAt,
      // New Google reviews arrive visible; an admin can hide them after.
      isVisible: true,
    });
    imported += 1;
  }

  const syncedAt = new Date();
  const settingsRow = await getOrCreateSettings();
  await db
    .update(settingsTable)
    .set({ googleReviewsSyncedAt: syncedAt })
    .where(eq(settingsTable.id, settingsRow.id));

  logger.info({ imported, updated, total: incoming.length }, "Google reviews sync complete");

  return {
    imported,
    updated,
    total: incoming.length,
    syncedAt: syncedAt.toISOString(),
  };
}
