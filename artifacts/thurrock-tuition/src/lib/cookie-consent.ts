/* ---------------------------------------------------------------------------
 * Cookie consent state.
 *
 * UK PECR (reg. 6) and the UK GDPR require *prior* consent for any cookie or
 * similar storage that is not strictly necessary to deliver the service the
 * visitor asked for. Two consequences shape this file:
 *
 *  - **Nothing non-essential may run before a choice is made.** Not "runs and
 *    stops on reject" — analytics must not load at all until accepted. So the
 *    default state is `null` (undecided), which reads as refusal everywhere.
 *
 *  - **Refusing must be as easy as accepting.** The banner shows Accept and
 *    Reject side by side, at the same weight. No cookie wall, no pre-ticked
 *    boxes, no "legitimate interest" opt-outs buried a click away.
 *
 * The session cookie the app sets after sign-in IS strictly necessary and is
 * therefore out of scope: it exists only because the visitor asked to log in.
 * That is why the banner never blocks it and never claims to.
 *
 * The choice itself lives in localStorage rather than a cookie, so recording a
 * refusal does not require setting the thing being refused.
 * ------------------------------------------------------------------------- */

const KEY = "tta.cookie-consent";

/**
 * Bump when the categories change. A stored decision from an older version is
 * treated as undecided, because consent given for one set of purposes is not
 * consent for a different set.
 */
const VERSION = 1;

export interface ConsentChoice {
  version: number;
  /** Always true — strictly necessary storage is not consented to, it just is. */
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

export type ConsentState = ConsentChoice | null;

/** Fired on the window whenever the decision changes, for listeners to react. */
export const CONSENT_EVENT = "tta:consent";

/**
 * Read the stored decision. Returns null when undecided, when the stored
 * decision predates the current category set, or when storage is unavailable
 * (private mode, blocked site data) — all of which must behave as refusal.
 */
export function readConsent(): ConsentState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed.version !== VERSION) return null;
    return {
      version: VERSION,
      essential: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Record a decision and tell the page about it. */
export function writeConsent(choice: { analytics: boolean; marketing: boolean }): ConsentChoice {
  const value: ConsentChoice = {
    version: VERSION,
    essential: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Storage blocked. The decision still applies for this page view; it just
    // cannot be remembered, so the banner returns on the next visit. Asking
    // again is the correct failure mode — assuming consent is not.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: value }));
  return value;
}

/** Forget the decision, so the banner asks again. */
export function clearConsent(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

/**
 * The gate every future non-essential script must pass through.
 *
 * When analytics is added, load it from a listener on CONSENT_EVENT guarded by
 * this — never from a module top level, which would run before any choice.
 */
export function hasConsent(category: "analytics" | "marketing"): boolean {
  const c = readConsent();
  return c ? c[category] : false;
}
