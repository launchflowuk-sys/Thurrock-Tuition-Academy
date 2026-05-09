import { SignIn, SignUp } from "@clerk/react";
import { Link } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#1B2B6B]">
      {/* Simple top bar */}
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
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>

      <div className="text-center py-4 text-white/40 text-xs">
        © {new Date().getFullYear()} Thurrock Tuition Academy ·{" "}
        <Link href="/" className="hover:text-white/70 transition-colors">Back to website</Link>
      </div>
    </div>
  );
}

export function SignInPage() {
  return (
    <AuthShell>
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        forceRedirectUrl={`${basePath}/auth-redirect`}
      />
    </AuthShell>
  );
}

export function SignUpPage() {
  return (
    <AuthShell>
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        forceRedirectUrl={`${basePath}/auth-redirect`}
      />
    </AuthShell>
  );
}
