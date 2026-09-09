import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@workspace/api-client-react";

/**
 * Sign in and sign up.
 *
 * No card, no shadow, no second ground. The wordmark sits bare on the page, a
 * real heading under it, the fields are the only boxes on the screen, one
 * full-width brand button. A white rounded panel floating on an almost-white
 * page adds an edge that means nothing.
 *
 * Auth behaviour is unchanged from before the redesign: same login/signup
 * calls, same /auth-redirect destination, same error handling.
 */

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const data = err.data as { error?: string } | null;
    if (data?.error) return data.error;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}

function AuthPage({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="dash auth-page">
      <div className="auth-inner">
        <Link className="auth-brand" href="/">
          <img src={`${basePath}/logo-mark-96.webp`} alt="" width="46" height="51" />
          <div>
            <strong>Thurrock Tuition</strong>
            <span>ACADEMY</span>
          </div>
        </Link>
        <h1>{title}</h1>
        <p className="auth-intro">{intro}</p>
        {children}
        <p className="auth-foot">{footer}</p>
      </div>
    </div>
  );
}

export function SignInPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      setLocation("/auth-redirect");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPage
      title="Sign in"
      intro="For parents and academy staff."
      footer={
        <>
          Don&rsquo;t have an account? <Link href="/sign-up">Create one</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="field-l">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field-l">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-d lg auth-submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthPage>
  );
}

export function SignUpPage() {
  const { signup } = useAuth();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup(email, password, fullName || undefined);
      setLocation("/auth-redirect");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPage
      title="Create your account"
      intro="Parent accounts give you your child's progress, homework and payments."
      footer={
        <>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="field-l">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="field-l">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field-l">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-d lg auth-submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthPage>
  );
}
