import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@workspace/api-client-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#1B2B6B]">
      <div className="px-6 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="TTA" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <p className="font-serif text-white font-bold text-base leading-tight">Thurrock Tuition</p>
            <p className="text-[#C9973A] text-xs">Academy</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>

      <div className="text-center py-4 text-white/40 text-xs">
        © {new Date().getFullYear()} Thurrock Tuition Academy ·{" "}
        <Link href="/" className="hover:text-white/70 transition-colors">Back to website</Link>
      </div>
    </div>
  );
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return "Incorrect email or password.";
    if (err.status === 409) return "An account with this email already exists.";
    return err.message;
  }
  return "Something went wrong. Please try again.";
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
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8">
        <h1 className="font-serif text-2xl font-bold text-[#1B2B6B] mb-1">Parent & Staff Login</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to access your Thurrock Tuition Academy portal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" data-testid="text-error">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1B2B6B] hover:bg-[#243580] text-white font-semibold rounded-xl py-2.5"
            data-testid="button-sign-in"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#1B2B6B] font-semibold hover:text-[#C9973A]">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
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
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8">
        <h1 className="font-serif text-2xl font-bold text-[#1B2B6B] mb-1">Create your account</h1>
        <p className="text-gray-500 text-sm mb-6">Join the Thurrock Tuition Academy portal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              data-testid="input-full-name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
            />
            <p className="text-xs text-gray-400">At least 8 characters</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" data-testid="text-error">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1B2B6B] hover:bg-[#243580] text-white font-semibold rounded-xl py-2.5"
            data-testid="button-sign-up"
          >
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#1B2B6B] font-semibold hover:text-[#C9973A]">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
