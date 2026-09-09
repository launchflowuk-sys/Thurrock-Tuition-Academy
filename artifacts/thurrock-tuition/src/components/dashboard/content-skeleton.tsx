/**
 * What the dashboard's *content area* shows while a page chunk arrives.
 *
 * The first attempt at fixing the white flash used one full-screen branded
 * loader for every route change. That fixed the white, but it was the wrong
 * shape: it replaced the whole application — dark rail included — so each
 * navigation still announced itself as "loading a new page", complete with a
 * logo and a progress bar. Shoji's words: the screens "still load like they
 * are loading new pages".
 *
 * A section change is not a page load, so it must not look like one. This
 * renders *inside* the shell: the rail, the topbar and the search all stay put
 * and only the panel area is replaced, by grey blocks in the same shape as the
 * content about to land. No logo, no spinner, nothing that reads as a splash.
 *
 * In practice it is rarely seen at all — `prefetchAdminRoutes()` warms every
 * chunk on idle after sign-in, so a click usually resolves from cache with no
 * suspension. This is the safety net for the click that beats the prefetch.
 */
export default function DashboardContentSkeleton() {
  return (
    <div className="dash-skeleton" role="status" aria-busy="true">
      <span className="sr-only-text">Loading…</span>
      <div className="sk sk-title" />
      <div className="sk sk-sub" />
      <div className="kpi-strip" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="sk sk-kpi" />
        ))}
      </div>
      <div className="sk sk-panel" aria-hidden="true" />
    </div>
  );
}
