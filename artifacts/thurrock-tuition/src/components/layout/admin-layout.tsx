import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useClerk } from "@clerk/react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  CheckSquare,
  CreditCard,
  LogOut,
  Menu,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/students", label: "Students", icon: Users },
  { href: "/sessions", label: "Sessions", icon: Calendar },
  { href: "/progress", label: "Progress", icon: GraduationCap },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = location.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
            data-testid={`nav-${item.label.toLowerCase()}`}
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
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
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
          <Sheet>
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
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>
              <nav className="p-4 space-y-1">
                <NavLinks />
              </nav>
              <div className="absolute bottom-0 w-full p-4 border-t border-sidebar-border space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  onClick={() => signOut({ redirectUrl: basePath || "/" })}
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