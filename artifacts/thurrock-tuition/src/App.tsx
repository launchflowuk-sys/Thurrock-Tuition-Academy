import { useEffect } from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandingPage } from "@/pages/landing";
import ServicesPage from "@/pages/services";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import { SignInPage, SignUpPage } from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import StudentsPage from "@/pages/students";
import StudentDetailPage from "@/pages/student-detail";
import SessionsPage from "@/pages/sessions";
import ProgressPage from "@/pages/progress";
import TasksPage from "@/pages/tasks";
import PaymentsPage from "@/pages/payments";
import ParentPortalPage from "@/pages/parent-portal";
import SettingsPage from "@/pages/settings";
import StaffPage from "@/pages/staff";
import IntakePage from "@/pages/intake";
import CoursesPage from "@/pages/courses";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/layout/admin-layout";
import { ScrollToTop } from "@/components/scroll-to-top";

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

  if (isLoading || !user) return null;

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1B2B6B] px-4">
        <img src={`${basePath}/logo.svg`} alt="TTA" className="h-16 mb-6 opacity-90" />
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold font-serif text-[#1B2B6B] mb-3">Access Restricted</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            This area is only accessible to authorised administrators. You are signed in as <strong>{user.email}</strong>.
          </p>
          <a
            href={`${basePath}/parent`}
            className="inline-block bg-[#1B2B6B] hover:bg-[#243580] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
          >
            Go to Parent Portal
          </a>
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
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

  if (isLoading || !user) return null;
  return <ParentPortalPage />;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ScrollToTop />
          <Switch>
            {/* Public website pages */}
            <Route path="/" component={HomeRedirect} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />

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

            <Route component={NotFound} />
          </Switch>
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
