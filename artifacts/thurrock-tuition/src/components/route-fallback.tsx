/**
 * What the screen shows while a route is still arriving.
 *
 * This exists because three separate places used to render `null`:
 * `<Suspense fallback={null}>` in App.tsx, and the `isLoading || !user` guard
 * in both AdminRoute and ParentRoute. Rendering null paints nothing, so the
 * entire app — dark rail included — vanished to bare white on:
 *
 *   - every hard load or refresh of a dashboard URL, while /api/auth/me was in
 *     flight; and
 *   - the first click through to each dashboard route, while that route's lazy
 *     chunk was fetched (every page is its own chunk, so this happened once
 *     per section per visit).
 *
 * A white page that then fills in reads as a full page reload, which is
 * exactly what it was reported as. Nothing was actually reloading: the app was
 * drawing nothing and then drawing something.
 *
 * The fix is that a route in transit must still look like the application.
 * This holds the page background and shows a quiet branded placeholder, so a
 * slow chunk reads as "loading" instead of "broken".
 */

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function RouteFallback({ label = "Loading" }: { label?: string }) {
  return (
    <div className="route-fallback" role="status" aria-live="polite" aria-busy="true">
      <img src={`${basePath}/logo.svg`} alt="" width="44" height="49" />
      <span className="route-fallback-bar" aria-hidden="true">
        <i />
      </span>
      {/* Announced, but not drawn — the visual is the logo and the bar. */}
      <span className="sr-only-text">{label}…</span>
    </div>
  );
}
