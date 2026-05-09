import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#1B2B6B] shadow-lg" : "bg-[#1B2B6B]/95 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img src={`${basePath}/logo.svg`} alt="TTA" className="h-10 w-auto" />
          <span className="font-serif text-white font-bold text-lg leading-tight hidden sm:block">
            Thurrock Tuition<br /><span className="text-[#C9973A] text-sm font-normal">Academy</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2"
            data-testid="link-signin"
          >
            Parent Login
          </Link>
          <Link
            href="/contact"
            className="bg-[#C9973A] hover:bg-[#b8872e] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            data-testid="link-book-assessment"
          >
            Book Free Assessment
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#1B2B6B] border-t border-white/10 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
            <Link href="/sign-in" className="block px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 text-sm transition-colors">
              Parent Login
            </Link>
            <Link href="/contact" className="block bg-[#C9973A] text-white text-center font-semibold px-4 py-3 rounded-xl transition-all">
              Book Free Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
