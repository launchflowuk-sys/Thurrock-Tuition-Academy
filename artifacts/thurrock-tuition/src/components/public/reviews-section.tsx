import { useListPublicReviews } from "@workspace/api-client-react";

/**
 * Parent reviews on the public homepage.
 *
 * Content comes from the database, not the markup: an admin adds reviews on
 * /reviews and can sync the academy's Google Business Profile listing. Renders
 * nothing at all when there are no visible reviews — an empty testimonials
 * section reads worse than no section.
 */

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    // role="img" is required: aria-label is prohibited on a bare <div>, which
    // has no implicit role, so screen readers would ignore the rating entirely
    // and announce five meaningless star glyphs instead.
    <div className="stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? undefined : "off"} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ReviewsSection() {
  const { data } = useListPublicReviews();

  const reviews = data?.reviews ?? [];
  if (reviews.length === 0) return null;

  return (
    <section className="section wrap" id="reviews">
      <div className="section-head">
        <div>
          <div className="eyebrow">From parents</div>
          <h2>
            What families
            <br />
            tell us.
          </h2>
        </div>
        {data?.averageRating != null && (
          <div className="review-summary">
            <b>{data.averageRating.toFixed(1)}</b>
            <span>
              average from {data.total} review{data.total === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>
      <div className="reviews">
        {reviews.map((review) => (
          <article className="review" key={review.id}>
            <Stars rating={review.rating} />
            <blockquote>{review.body}</blockquote>
            <div className="who">
              {review.authorPhotoUrl ? (
                <img src={review.authorPhotoUrl} alt="" width="42" height="42" loading="lazy" />
              ) : (
                <span className="initials" aria-hidden="true">
                  {initialsOf(review.authorName)}
                </span>
              )}
              <div>
                <strong>{review.authorName}</strong>
                {review.relationship && <small>{review.relationship}</small>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
