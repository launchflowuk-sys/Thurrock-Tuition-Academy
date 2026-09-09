import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CONSENT_EVENT, readConsent, writeConsent, type ConsentState } from "@/lib/cookie-consent";

/**
 * The cookie consent banner.
 *
 * Accept and Reject sit side by side at the same visual weight, because PECR
 * consent is not freely given if refusing is harder than agreeing. There is no
 * cookie wall: the site is entirely usable with everything refused, and the
 * banner can be dismissed by refusing rather than only by accepting.
 *
 * It renders nothing until mounted and nothing once a decision exists, so it
 * never flashes for a returning visitor who already answered.
 *
 * Deliberately not a modal dialog: it does not trap focus and does not block
 * the page. A parent who arrived to read the pricing can read the pricing. It
 * is an aside with a polite live region, announced but not interrupting.
 */

/** A footer/anywhere link that reopens the banner. Exported for the shell. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "inherit", textDecoration: "underline", cursor: "pointer" }}
      onClick={() => window.dispatchEvent(new CustomEvent("tta:consent-reopen"))}
    >
      Cookie settings
    </button>
  );
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [ready, setReady] = useState(false);
  const [reopened, setReopened] = useState(false);
  const [detailed, setDetailed] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setAnalytics(stored?.analytics ?? false);
    setMarketing(stored?.marketing ?? false);
    setReady(true);

    const onChange = (e: Event) => setConsent((e as CustomEvent<ConsentState>).detail ?? null);
    const onReopen = () => {
      const current = readConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setDetailed(true);
      setReopened(true);
      // Move focus to the panel so a keyboard user is taken to the thing they
      // just asked to open, rather than left where the link was.
      window.setTimeout(() => panel.current?.focus(), 0);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener("tta:consent-reopen", onReopen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener("tta:consent-reopen", onReopen);
    };
  }, []);

  const decide = useCallback((choice: { analytics: boolean; marketing: boolean }) => {
    writeConsent(choice);
    setReopened(false);
    setDetailed(false);
  }, []);

  // Nothing before hydration (avoids a flash), nothing once decided — unless
  // the visitor asked to change their mind.
  if (!ready) return null;
  if (consent && !reopened) return null;

  return (
    <aside
      className="cookie-bar"
      role="region"
      aria-label="Cookie choices"
      aria-live="polite"
    >
      <div className="cookie-inner" ref={panel} tabIndex={-1}>
        <div className="cookie-copy">
          <strong>Cookies on this site</strong>
          <p>
            We use cookies that are strictly necessary to run the site and keep you signed in.
            We would also like to use optional cookies to understand how families find us. We only
            set the optional ones if you say yes, and the site works exactly the same if you say no.{" "}
            <Link href="/privacy">Read our privacy &amp; cookie notice</Link>.
          </p>

          {detailed && (
            <div className="cookie-options">
              <label className="cookie-option locked">
                <input type="checkbox" checked disabled readOnly />
                <span>
                  <strong>Strictly necessary</strong> — signing in, keeping your session, and
                  remembering this choice. Always on; the site cannot work without them.
                </span>
              </label>
              <label className="cookie-option">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span>
                  <strong>Analytics</strong> — anonymous counts of which pages parents read, so we
                  know what to improve. Off by default.
                </span>
              </label>
              <label className="cookie-option">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
                <span>
                  <strong>Marketing</strong> — measuring whether an advert brought you here. Off by
                  default. We never sell your data or your child&rsquo;s.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Accept and Reject are the same size and the same prominence. */}
        <div className="cookie-actions">
          {detailed ? (
            <>
              <button type="button" className="btn" onClick={() => decide({ analytics, marketing })}>
                Save my choices
              </button>
              <button type="button" className="btn outline" onClick={() => decide({ analytics: false, marketing: false })}>
                Reject optional
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn" onClick={() => decide({ analytics: true, marketing: true })}>
                Accept all
              </button>
              <button type="button" className="btn outline" onClick={() => decide({ analytics: false, marketing: false })}>
                Reject optional
              </button>
              <button type="button" className="cookie-link" onClick={() => setDetailed(true)}>
                Choose individually
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
