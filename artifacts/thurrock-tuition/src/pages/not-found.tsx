// Ported verbatim from the approved design handover
// (Thurrock-Tuition-Claude-Code-Handover/reference/dist/404).
// Structure, class names, copy and inline SVG are the reference's; only
// links are routed through wouter. Styling lives in src/styles/tta-public.css.
import { Link } from "wouter";
import PublicShell from "@/components/public/public-shell";

export default function NotFound() {
  return (
    <PublicShell active="" mainClassName="wrap section">

      <div className="eyebrow">Page not found</div>
      <h1>Let’s get you back<br />on the right path.</h1>
      <p className="lead">This page isn’t available. Explore our tuition or get in touch with the academy.</p>
      <div className="actions">
      <Link className="btn " href="/">Back to home<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      <Link className="btn outline" href="/services">Our tuition<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" />
      </svg>
      </Link>
      </div>

    </PublicShell>
  );
}
