import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Scroll behaviour on navigation.
 *
 * Two things were broken here. This component used to scroll to the top on
 * every location change unconditionally, which meant a link like
 * /services#pricing landed the visitor at the top of the page instead of on
 * the section — the footer's anchor links all looked dead. And on a cold load
 * the browser's own hash scroll happens before React has rendered the route, so
 * the target element does not exist yet and nothing moves.
 *
 * So: no hash means top of page; a hash means scroll to that element, retrying
 * across frames until the lazily-rendered route has painted it.
 */

// The header is sticky. The design's stylesheet expresses this as
// scroll-padding-top:112px; programmatic scrolling has to subtract it itself.
const HEADER_OFFSET = 112;
// ~1s at 60fps. Long enough for a lazy route chunk, short enough that a genuinely
// missing anchor doesn't leave a timer running.
const MAX_FRAMES = 60;

function scrollToHashTarget(): boolean {
  const hash = window.location.hash.slice(1);

  if (!hash) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return true;
  }

  const el = document.getElementById(hash);
  if (!el) return false;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  return true;
}

export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (scrollToHashTarget()) return;

    // The anchor belongs to a route chunk that has not rendered yet.
    let frames = 0;
    let raf = requestAnimationFrame(function retry() {
      if (scrollToHashTarget() || frames++ > MAX_FRAMES) return;
      raf = requestAnimationFrame(retry);
    });
    return () => cancelAnimationFrame(raf);
  }, [location]);

  // wouter's location tracks the pathname only, so a hash-only change — a
  // footer link to #faq while already on /contact — never re-runs the effect
  // above. Handle those separately.
  useEffect(() => {
    const onHashChange = () => {
      scrollToHashTarget();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
