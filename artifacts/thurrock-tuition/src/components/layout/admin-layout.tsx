import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  CreditCard,
  LogOut,
  Menu,
  GraduationCap,
  Settings,
  UserCog,
  BookOpen,
  ClipboardList,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/intake", label: "Applications", icon: ClipboardList },
  { href: "/students", label: "Students", icon: Users },
  { href: "/sessions", label: "Sessions", icon: Calendar },
  { href: "/progress", label: "Progress", icon: GraduationCap },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/staff", label: "Staff", icon: UserCog },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleSignOut = async () => {
    await logout();
    setLocation("/");
  };

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = location.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed inset-y-0 z-10">
        <div className="p-6 border-b border-sidebar-border flex items-center justify-center">
          <img src={`${basePath}/logo.svg`} alt="TTA Logo" className="h-16 w-auto" />
        </div>
        <div className="p-4 border-b border-sidebar-border">
          <div className="text-sidebar-foreground text-sm font-medium truncate">
            {user?.fullName || "Admin"}
          </div>
          <div className="text-sidebar-foreground/70 text-xs truncate">
            {user?.email}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
            onClick={handleSignOut}
            data-testid="button-logout"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </Button>
          <p className="text-center text-[10px] text-sidebar-foreground/40">
            Website by{" "}
            <a
              href="https://launchflow.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9973A]/70 hover:text-[#C9973A] transition-colors"
            >
              LaunchFlow
            </a>
          </p>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="md:hidden sticky top-0 z-20 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
          <img src={`${basePath}/logo.svg`} alt="TTA Logo" className="h-8 w-auto" />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-sidebar border-r-sidebar-border">
              <div className="p-6 border-b border-sidebar-border flex items-center justify-center">
                <img src={`${basePath}/logo.svg`} alt="TTA Logo" className="h-16 w-auto" />
              </div>
              <div className="p-4 border-b border-sidebar-border">
                <div className="text-sidebar-foreground text-sm font-medium truncate">
                  {user?.fullName || "Admin"}
                </div>
                <div className="text-sidebar-foreground/70 text-xs truncate">
                  {user?.email}
                </div>
              </div>
              <nav className="p-4 space-y-1">
                <NavLinks onClose={() => setMobileOpen(false)} />
              </nav>
              <div className="absolute bottom-0 w-full p-4 border-t border-sidebar-border space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  onClick={() => { handleSignOut(); setMobileOpen(false); }}
                >
                  <LogOut size={20} className="mr-3" />
                  Sign Out
                </Button>
                <p className="text-center text-[10px] text-sidebar-foreground/40">
                  Website by{" "}
                  <a
                    href="https://launchflow.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9973A]/70 hover:text-[#C9973A] transition-colors"
                  >
                    LaunchFlow
                  </a>
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
