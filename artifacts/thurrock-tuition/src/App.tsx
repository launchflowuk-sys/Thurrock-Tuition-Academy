import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingPage } from "@/pages/landing";
import { SignInPage, SignUpPage } from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import EnquiriesPage from "@/pages/enquiries";
import StudentsPage from "@/pages/students";
import StudentDetailPage from "@/pages/student-detail";
import SessionsPage from "@/pages/sessions";
import ProgressPage from "@/pages/progress";
import TasksPage from "@/pages/tasks";
import PaymentsPage from "@/pages/payments";
import ParentPortalPage from "@/pages/parent-portal";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/layout/admin-layout";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#1B2B6B",
    colorForeground: "#1a1a2e",
    colorMutedForeground: "#6b7280",
    colorDanger: "#dc2626",
    colorBackground: "#f8f7f4",
    colorInput: "#ffffff",
    colorInputForeground: "#1a1a2e",
    colorNeutral: "#d1d5db",
    fontFamily: "'Crimson Pro', Georgia, serif",
    borderRadius: "4px",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded shadow-lg w-[440px] max-w-full overflow-hidden border border-gray-200",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#1B2B6B] font-serif",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButtonText: "text-gray-700",
    formFieldLabel: "text-gray-700 font-medium",
    footerActionLink: "text-[#1B2B6B] hover:text-[#C9973A]",
    footerActionText: "text-gray-500",
    dividerText: "text-gray-400",
    identityPreviewEditButton: "text-[#1B2B6B]",
    formFieldSuccessText: "text-green-600",
    alertText: "text-red-600",
    logoBox: "flex justify-center",
    logoImage: "h-12 w-auto",
    socialButtonsBlockButton: "border border-gray-200 hover:border-gray-300",
    formButtonPrimary: "bg-[#1B2B6B] hover:bg-[#15235a] text-white",
    formFieldInput: "border border-gray-300 rounded",
    footerAction: "bg-gray-50",
    dividerLine: "bg-gray-200",
    alert: "bg-red-50 border-red-200",
    otpCodeFieldInput: "border-gray-300",
    formFieldRow: "",
    main: "",
  },
};

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <AdminLayout>{children}</AdminLayout>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ParentRoute() {
  return (
    <>
      <Show when="signed-in">
        <ParentPortalPage />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to Thurrock Tuition Academy",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Join Thurrock Tuition Academy",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/dashboard">
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            </Route>
            <Route path="/enquiries">
              <ProtectedRoute><EnquiriesPage /></ProtectedRoute>
            </Route>
            <Route path="/students/:id">
              {(params) => (
                <ProtectedRoute><StudentDetailPage id={Number(params.id)} /></ProtectedRoute>
              )}
            </Route>
            <Route path="/students">
              <ProtectedRoute><StudentsPage /></ProtectedRoute>
            </Route>
            <Route path="/sessions">
              <ProtectedRoute><SessionsPage /></ProtectedRoute>
            </Route>
            <Route path="/progress">
              <ProtectedRoute><ProgressPage /></ProtectedRoute>
            </Route>
            <Route path="/tasks">
              <ProtectedRoute><TasksPage /></ProtectedRoute>
            </Route>
            <Route path="/payments">
              <ProtectedRoute><PaymentsPage /></ProtectedRoute>
            </Route>
            <Route path="/parent">
              <ParentRoute />
            </Route>
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
