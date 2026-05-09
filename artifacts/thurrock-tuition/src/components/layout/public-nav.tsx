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

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#1B2B6B] shadow-2xl shadow-[#1B2B6B]/30"
            : "bg-[#1B2B6B]/95 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={`${basePath}/logo.svg`}
              alt="TTA"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif text-white font-bold text-lg leading-tight hidden sm:block">
              Thurrock Tuition
              <br />
              <span className="text-[#C9973A] text-sm font-normal">Academy</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 bg-white/15 rounded-lg" />
                  )}
                  <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#C9973A] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 px-3 py-2"
            >
              Parent Login
            </Link>
            <Link
              href="/contact"
              className="bg-[#C9973A] hover:bg-[#b8872e] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-[#C9973A]/20 hover:shadow-lg hover:shadow-[#C9973A]/30 hover:-translate-y-0.5"
            >
              Book Free Assessment
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute transition-all duration-300 ${
                open ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
              }`}
            >
              <X size={22} />
            </span>
            <span
              className={`absolute transition-all duration-300 ${
                open ? "opacity-0 -rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
              }`}
            >
              <Menu size={22} />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        style={{ background: "rgba(11, 18, 52, 0.7)", backdropFilter: "blur(4px)" }}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-16 left-0 right-0 z-50 md:hidden transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="mx-3 mt-1 rounded-2xl overflow-hidden shadow-2xl shadow-[#1B2B6B]/50 border border-white/10"
             style={{ background: "linear-gradient(135deg, #1e3280 0%, #1B2B6B 60%, #152260 100%)" }}>

          {/* Nav links */}
          <nav className="p-3 space-y-1">
            {NAV_LINKS.map((link, i) => {
              const active = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-base transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-white shadow-inner"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
                    transitionDelay: open ? `${i * 40}ms` : "0ms",
                    transform: open ? "translateX(0)" : "translateX(-8px)",
                    opacity: open ? 1 : 0,
                    transition: `all 0.25s ease ${open ? i * 40 : 0}ms`,
                  }}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9973A] shrink-0" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="mx-4 border-t border-white/10" />

          {/* Action buttons */}
          <div className="p-3 space-y-2">
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium transition-all duration-200"
              style={{
                transitionDelay: open ? "160ms" : "0ms",
                opacity: open ? 1 : 0,
                transition: `all 0.25s ease ${open ? 160 : 0}ms`,
              }}
            >
              Parent Login
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center w-full bg-[#C9973A] hover:bg-[#b8872e] text-white font-bold px-4 py-3.5 rounded-xl text-base shadow-lg shadow-[#C9973A]/20 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                transitionDelay: open ? "200ms" : "0ms",
                opacity: open ? 1 : 0,
                transition: `all 0.25s ease ${open ? 200 : 0}ms`,
              }}
            >
              Book Free Assessment →
            </Link>
          </div>

          {/* Bottom info strip */}
          <div className="px-4 py-3 border-t border-white/8 flex items-center justify-between">
            <span className="text-white/40 text-xs">Grays, Thurrock · 07480 413679</span>
            <a
              href="https://wa.me/447480413679"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] text-xs font-semibold hover:text-[#1ab553] transition-colors"
            >
              WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
