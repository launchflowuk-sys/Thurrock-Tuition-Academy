import { useState } from "react";
import {
  useListReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useSyncGoogleReviews,
  getListReviewsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Kpi, Panel, Pill } from "@/components/dashboard/primitives";
import { useToast } from "@/hooks/use-toast";

/**
 * Parent reviews shown on the public homepage.
 *
 * Two sources in one list: reviews typed in here, and reviews synced from the
 * academy's Google Business Profile. Google's API terms don't permit editing
 * the text, rating or author of a Google review, so synced rows only expose
 * show/hide and ordering — that restriction is enforced server-side too.
 */

const emptyDraft = { authorName: "", relationship: "", rating: 5, body: "" };

export default function ReviewsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: reviews } = useListReviews();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();
  const syncGoogle = useSyncGoogleReviews();
  const [draft, setDraft] = useState(emptyDraft);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });

  const all = reviews ?? [];
  const visible = all.filter((r) => r.isVisible);
  const fromGoogle = all.filter((r) => r.source === "google");
  const average =
    visible.length > 0
      ? (visible.reduce((sum, r) => sum + r.rating, 0) / visible.length).toFixed(1)
      : "—";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.authorName.trim() || !draft.body.trim()) {
      toast({ title: "A name and a review are both required", variant: "destructive" });
      return;
    }
    try {
      await createReview.mutateAsync({
        data: {
          authorName: draft.authorName.trim(),
          relationship: draft.relationship.trim() || null,
          rating: Number(draft.rating),
          body: draft.body.trim(),
        },
      });
      setDraft(emptyDraft);
      refresh();
      toast({ title: "Review added" });
    } catch {
      toast({ title: "Could not add the review", variant: "destructive" });
    }
  };

  const toggleVisible = async (id: number, isVisible: boolean) => {
    await updateReview.mutateAsync({ id, data: { isVisible: !isVisible } });
    refresh();
  };

  const remove = async (id: number) => {
    await deleteReview.mutateAsync({ id });
    refresh();
    toast({ title: "Review deleted" });
  };

  const handleSync = async () => {
    try {
      const result = await syncGoogle.mutateAsync();
      refresh();
      toast({
        title: `Google sync complete — ${result.imported} new, ${result.updated} updated`,
      });
    } catch (err) {
      const message =
        (err as { data?: { error?: string } })?.data?.error ??
        "Sync failed. Check the Place ID and API key in Settings.";
      toast({ title: message, variant: "destructive" });
    }
  };

  return (
    <>
      <h1 className="dash-page-title">Reviews</h1>
      <p className="dash-page-sub">
        What appears in the &ldquo;What families tell us&rdquo; section of the homepage.
      </p>

      <div className="kpi-strip">
        <Kpi ground="navy" label="Showing publicly" value={String(visible.length)} note={`${all.length} total`} />
        <Kpi ground="teal" label="Average rating" value={average} note="Across visible reviews" />
        <Kpi ground="cobalt" label="From Google" value={String(fromGoogle.length)} note="Synced from your listing" />
        <Kpi
          ground={visible.length === 0 ? "amber" : "purple"}
          label="Homepage section"
          value={visible.length === 0 ? "Hidden" : "Live"}
          note={visible.length === 0 ? "Hidden while nothing is visible" : "Visible to visitors"}
        />
      </div>

      <Panel
        title="Add a review"
        subtitle="For reviews given by email, WhatsApp or in person"
      >
        <form onSubmit={handleCreate}>
          <div className="panel-grid">
            <div className="field-l">
              <label htmlFor="authorName">Parent name</label>
              <input
                id="authorName"
                type="text"
                value={draft.authorName}
                onChange={(e) => setDraft({ ...draft, authorName: e.target.value })}
                placeholder="e.g. Priya S."
              />
            </div>
            <div className="field-l">
              <label htmlFor="relationship">Shown under the name</label>
              <input
                id="relationship"
                type="text"
                value={draft.relationship}
                onChange={(e) => setDraft({ ...draft, relationship: e.target.value })}
                placeholder="e.g. Parent of GCSE student"
              />
            </div>
            <div className="field-l">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                value={draft.rating}
                onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field-l" style={{ marginTop: 16 }}>
            <label htmlFor="body">Review</label>
            <textarea
              id="body"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              placeholder="What the parent said, in their words."
            />
          </div>
          <button type="submit" className="btn-d" disabled={createReview.isPending} style={{ marginTop: 16 }}>
            {createReview.isPending ? "Adding…" : "Add review"}
          </button>
        </form>
      </Panel>

      <Panel
        title="Google Business Profile"
        subtitle="Pulls the latest reviews from your Google listing. Google returns at most five."
        actions={
          <button type="button" className="btn-d ghost" onClick={handleSync} disabled={syncGoogle.isPending}>
            {syncGoogle.isPending ? "Syncing…" : "Sync now"}
          </button>
        }
      >
        <p className="panel-sub" style={{ margin: 0 }}>
          Set the Place ID and API key under Settings first. Synced reviews can be
          hidden or reordered here, but their text cannot be edited — Google&rsquo;s
          terms do not allow it.
        </p>
      </Panel>

      <Panel title="All reviews" subtitle="Hidden reviews stay here but never appear on the site">
        {all.length === 0 ? (
          <p className="empty">No reviews yet. Add one above, or sync your Google listing.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Parent</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {all.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <strong>{review.authorName}</strong>
                      {review.relationship && (
                        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{review.relationship}</div>
                      )}
                    </td>
                    <td className="num">{review.rating}/5</td>
                    <td style={{ maxWidth: 420 }}>{review.body}</td>
                    <td>
                      <Pill ground={review.source === "google" ? "cobalt" : "grey"}>
                        {review.source === "google" ? "Google" : "Manual"}
                      </Pill>
                    </td>
                    <td>
                      <Pill ground={review.isVisible ? "teal" : "grey"}>
                        {review.isVisible ? "Showing" : "Hidden"}
                      </Pill>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          className="btn-d ghost sm"
                          onClick={() => toggleVisible(review.id, review.isVisible)}
                        >
                          {review.isVisible ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          className="btn-d danger sm"
                          onClick={() => remove(review.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
