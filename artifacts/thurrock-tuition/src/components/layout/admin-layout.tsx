import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  BookOpen,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Settings,
  Star,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/**
 * The dashboard shell: a dark left rail on a white workspace.
 *
 * One dark thing on the page, and this is it. The workspace, every panel and
 * every table stay white — reading is what a dark surface is worst at. Colour
 * lives on the KPI cards and the status pills, nowhere else.
 */

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/intake", label: "Applications", icon: ClipboardList },
  { href: "/students", label: "Students", icon: Users },
  { href: "/sessions", label: "Sessions", icon: Calendar },
  { href: "/attendance", label: "Register", icon: ClipboardCheck },
  { href: "/progress", label: "Progress", icon: GraduationCap },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/staff", label: "Staff", icon: UserCog },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [railOpen, setRailOpen] = useState(false);

  useEffect(() => {
    setRailOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await logout();
    setLocation("/sign-in");
  };

  return (
    <div className="dash">
      <div className="dash-shell">
        <aside className={railOpen ? "dash-rail open" : "dash-rail"}>
          <div className="dash-rail-brand">
            <img src={`${basePath}/logo.svg`} alt="" width="38" height="42" />
            <div>
              <strong>Thurrock Tuition</strong>
              <span>ACADEMY</span>
            </div>
          </div>

          <nav className="dash-nav" aria-label="Dashboard navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                location === item.href || location.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? "active" : undefined}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="dash-rail-foot">
            {user && <div className="dash-rail-user">{user.email}</div>}
            <button type="button" className="btn-d ghost sm" onClick={handleSignOut} style={{ width: "100%", background: "rgba(255,255,255,.09)", color: "#fff", borderColor: "transparent" }}>
              Sign out
            </button>
          </div>
        </aside>

        {railOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setRailOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 25,
              background: "rgba(11,16,32,.45)",
              border: 0,
            }}
          />
        )}

        <div className="dash-main">
          <div className="dash-topbar">
            <button
              type="button"
              className="btn-d ghost dash-menu-btn in-row"
              aria-label={railOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={railOpen}
              onClick={() => setRailOpen((v) => !v)}
            >
              {railOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            {/* The widest control in the app, so it looks like it. */}
            <input
              className="dash-search"
              type="search"
              placeholder="Search students, sessions, applications…"
              aria-label="Search the academy"
            />
            <Link className="btn-d in-row" href="/intake">
              New application
            </Link>
          </div>

          <div className="dash-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
