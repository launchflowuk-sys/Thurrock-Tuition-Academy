import { useEffect, useRef } from "react";
import { ClerkProvider, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { Switch, Route, Redirect, useLocation, Router as WouterRouter } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingPage } from "@/pages/landing";
import ServicesPage from "@/pages/services";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
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
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/layout/admin-layout";
import { ScrollToTop } from "@/components/scroll-to-top";

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
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#1B2B6B",
    colorText: "#1a1a2e",
    colorTextSecondary: "#6b7280",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#1a1a2e",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "10px",
    fontSize: "14px",
  },
  elements: {
    card: "shadow-xl border border-gray-200 rounded-2xl",
    headerTitle: "font-serif text-[#1B2B6B]",
    headerSubtitle: "text-gray-500",
    socialButtonsBlockButton: "border border-gray-200 hover:border-gray-300 rounded-xl font-medium text-gray-700 bg-white",
    socialButtonsBlockButtonText: "text-gray-700",
    formFieldLabel: "text-gray-700 font-semibold text-sm",
    formFieldInput: "border border-gray-300 rounded-xl px-3 py-2 text-gray-900 bg-white focus:border-[#1B2B6B] focus:ring-[#1B2B6B]",
    formButtonPrimary: "bg-[#1B2B6B] hover:bg-[#243580] text-white font-semibold rounded-xl py-2.5 transition-all",
    footerActionLink: "text-[#1B2B6B] font-semibold hover:text-[#C9973A]",
    footerActionText: "text-gray-500",
    footerAction: "bg-gray-50 border-t border-gray-100",
    dividerText: "text-gray-400 text-xs",
    dividerLine: "bg-gray-200",
    identityPreviewEditButton: "text-[#1B2B6B]",
    alert: "rounded-xl",
    alertText: "text-red-700",
    logoBox: "pt-2",
  },
};

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/parent" />
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
        <Redirect to="/sign-in" />
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
        <Redirect to="/sign-in" />
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
            title: "Parent & Staff Login",
            subtitle: "Sign in to access your Thurrock Tuition Academy portal",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Join the Thurrock Tuition Academy portal",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <ScrollToTop />
          <Switch>
            {/* Public website pages */}
            <Route path="/" component={HomeRedirect} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />

            {/* Auth pages */}
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />

            {/* Parent portal — sign in goes here by default */}
            <Route path="/parent">
              <ParentRoute />
            </Route>

            {/* Admin-only routes — no links anywhere on public site */}
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
            <Route path="/settings">
              <ProtectedRoute><SettingsPage /></ProtectedRoute>
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
