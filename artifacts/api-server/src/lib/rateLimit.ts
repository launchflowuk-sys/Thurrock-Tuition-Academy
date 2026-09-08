import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";

// Rate limiters for the handful of endpoints that are reachable without a
// session. Everything else is already behind requireAuth/requireAdmin, so the
// session cookie is the throttle.
//
// `trust proxy` is set to 1 in app.ts, so req.ip is the client address from
// X-Forwarded-For rather than the reverse proxy's own address — without that,
// every request would share a single bucket.

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Brute-force protection for password checks. Counts only failed attempts so a
// legitimately busy household doesn't lock itself out.
export const loginLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Please try again in 15 minutes." },
});

// Account-creation flood protection.
export const signupLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: ONE_HOUR,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many accounts created from this address. Please try again later." },
});

// The public intake form triggers two outbound emails per submission, so an
// unthrottled bot here burns the SMTP quota as well as filling the table.
export const intakeLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: ONE_HOUR,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many applications submitted. Please try again later, or WhatsApp us on 07480 413679." },
});

// Password changes are session-gated, but a stolen session shouldn't get
// unlimited guesses at the current password.
export const changePasswordLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many password change attempts. Please try again in 15 minutes." },
});
