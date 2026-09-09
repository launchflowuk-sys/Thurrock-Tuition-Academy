import { Suspense, lazy, useEffect } from "react";
import { Switch, Route, useLocation, Link, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/scroll-to-top";
import RouteFallback from "@/components/route-fallback";
import DashboardContentSkeleton from "@/components/dashboard/content-skeleton";

// Eager: the public marketing pages and auth screens. These are the SEO-facing
// entry points and must not wait on a second network round-trip.
import LandingPage from "@/pages/landing";
import ServicesPage from "@/pages/services";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import PrivacyPage from "@/pages/privacy";
import { SignInPage, SignUpPage } from "@/pages/auth";
import NotFound from "@/pages/not-found";

// Lazy: the admin dashboard and parent portal. A visitor reading the public
// site never signs in, so shipping the whole back office to them just inflates
// the first paint. Split out, each is fetched on first navigation instead.
const AdminLayout = lazy(() => import("@/components/layout/admin-layout"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const StudentsPage = lazy(() => import("@/pages/students"));
const StudentDetailPage = lazy(() => import("@/pages/student-detail"));
const SessionsPage = lazy(() => import("@/pages/sessions"));
const ProgressPage = lazy(() => import("@/pages/progress"));
const TasksPage = lazy(() => import("@/pages/tasks"));
const PaymentsPage = lazy(() => import("@/pages/payments"));
const ParentPortalPage = lazy(() => import("@/pages/parent-portal"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const StaffPage = lazy(() => import("@/pages/staff"));
const IntakePage = lazy(() => import("@/pages/intake"));
const CoursesPage = lazy(() => import("@/pages/courses"));
const ReviewsPage = lazy(() => import("@/pages/reviews"));
const AttendancePage = lazy(() => import("@/pages/attendance"));

/**
 * Warm the dashboard chunks once the browser is idle.
 *
 * Each admin page is its own chunk, so the *first* click into a section had to
 * wait on a network fetch before it could draw anything. Pulling them in
 * during idle time means the click is served from cache and the transition is
 * immediate. These are the same `import()` calls the `lazy()` wrappers use, so
 * a warmed module is shared, not fetched twice.
 *
 * Fire-and-forget on purpose: a failed prefetch must not surface an error, it
 * just means the click pays the original cost. Guarded so it runs once.
 */
let prefetched = false;
function prefetchAdminRoutes() {
  if (prefetched) return;
  prefetched = true;
  const load = () => {
    void Promise.allSettled([
      import("@/components/layout/admin-layout"),
      import("@/pages/dashboard"),
      import("@/pages/intake"),
      import("@/pages/students"),
      import("@/pages/sessions"),
      import("@/pages/attendance"),
      import("@/pages/progress"),
      import("@/pages/tasks"),
      import("@/pages/payments"),
      import("@/pages/courses"),
      import("@/pages/reviews"),
      import("@/pages/staff"),
      import("@/pages/settings"),
    ]);
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(load, { timeout: 2500 });
  } else {
    window.setTimeout(load, 1200);
  }
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function HomeRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/parent", { replace: true });
    }
  }, [isLoading, user, setLocation]);

  if (isLoading || user) return null;
  return <LandingPage />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/sign-in", { replace: true });
    }
  }, [isLoading, user, setLocation]);

  useEffect(() => {
    if (user?.role === "admin") prefetchAdminRoutes();
  }, [user]);

  // Was `return null`, which painted a bare white page on every refresh of a
  // dashboard URL while /api/auth/me was still in flight.
  if (isLoading || !user) return <RouteFallback label="Checking your sign-in" />;

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1B2B6B] px-4">
        <img src={`${basePath}/logo-badge-96.webp`} alt="TTA" className="h-16 mb-6 opacity-90" />
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold font-serif text-[#1B2B6B] mb-3">Access Restricted</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            This area is only accessible to authorised administrators. You are signed in as <strong>{user.email}</strong>.
          </p>
          {/* Wouter Link, not a bare anchor — an anchor here threw away the
              whole SPA and reloaded the app from scratch. */}
          <Link
            href="/parent"
            className="inline-block bg-[#1B2B6B] hover:bg-[#243580] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
          >
            Go to Parent Portal
          </Link>
        </div>
      </div>
    );
  }

  // The Suspense boundary belongs INSIDE the layout, not around it.
  //
  // With one boundary wrapping the whole Switch, a page chunk suspended the
  // entire admin tree — AdminLayout included — so every section change tore
  // the rail and topbar off screen and replaced them with a full-page loader.
  // That is why navigation still "looked like loading a new page" even after
  // the white flash was gone: it was a splash screen between every click.
  //
  // Boundaries resolve to the nearest ancestor, so putting one here keeps the
  // shell mounted and swaps only the panel area for a matching skeleton.
  // AdminLayout is still lazy, so the outer boundary covers it once at cold
  // boot and never again.
  return (
    <AdminLayout>
      <Suspense fallback={<DashboardContentSkeleton />}>{children}</Suspense>
    </AdminLayout>
  );
}

function AuthRedirect() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setLocation("/sign-in", { replace: true });
      return;
    }

    if (user.role === "admin") {
      setLocation("/dashboard", { replace: true });
      return;
    }

    setLocation("/parent", { replace: true });
  }, [isLoading, user, setLocation]);

  return null;
}

function ParentRoute() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/sign-in", { replace: true });
    }
  }, [isLoading, user, setLocation]);

  // Same reason as AdminRoute: null here was a white page on every refresh.
  if (isLoading || !user) return <RouteFallback label="Checking your sign-in" />;
  return <ParentPortalPage />;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ScrollToTop />
          {/* Never `null`: every admin page is its own chunk, so a null
              fallback blanked the entire app — dark rail included — on the
              first click into each section. That read as a page reload. */}
          <Suspense fallback={<RouteFallback />}>
          <Switch>
            {/* Public website pages */}
            <Route path="/" component={HomeRedirect} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            {/* The consent banner links here, so it must resolve on the very
                first visit — eager, not lazy. */}
            <Route path="/privacy" component={PrivacyPage} />

            {/* Auth pages */}
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/sign-up" component={SignUpPage} />

            {/* Smart post-login redirect — sends admin to /dashboard, parents to /parent */}
            <Route path="/auth-redirect">
              <AuthRedirect />
            </Route>

            {/* Parent portal — sign in goes here by default */}
            <Route path="/parent">
              <ParentRoute />
            </Route>

            {/* Admin-only routes — no links anywhere on public site */}
            <Route path="/dashboard">
              <AdminRoute><Dashboard /></AdminRoute>
            </Route>
            <Route path="/students/:id">
              {(params) => (
                <AdminRoute><StudentDetailPage id={Number(params.id)} /></AdminRoute>
              )}
            </Route>
            <Route path="/students">
              <AdminRoute><StudentsPage /></AdminRoute>
            </Route>
            <Route path="/sessions">
              <AdminRoute><SessionsPage /></AdminRoute>
            </Route>
            <Route path="/progress">
              <AdminRoute><ProgressPage /></AdminRoute>
            </Route>
            <Route path="/tasks">
              <AdminRoute><TasksPage /></AdminRoute>
            </Route>
            <Route path="/payments">
              <AdminRoute><PaymentsPage /></AdminRoute>
            </Route>
            <Route path="/settings">
              <AdminRoute><SettingsPage /></AdminRoute>
            </Route>
            <Route path="/staff">
              <AdminRoute><StaffPage /></AdminRoute>
            </Route>
            <Route path="/intake">
              <AdminRoute><IntakePage /></AdminRoute>
            </Route>
            <Route path="/courses">
              <AdminRoute><CoursesPage /></AdminRoute>
            </Route>
            <Route path="/reviews">
              <AdminRoute><ReviewsPage /></AdminRoute>
            </Route>
            <Route path="/attendance">
              <AdminRoute><AttendancePage /></AdminRoute>
            </Route>

            <Route component={NotFound} />
          </Switch>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AppRoutes />
    </WouterRouter>
  );
}

export default App;
