import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowIcon, MenuIcon } from "./icons";

// Shared chrome for every public page, ported from the design handover
// (Thurrock-Tuition-Claude-Code-Handover/reference/dist). Markup, class names
// and copy are the reference's; only the links and the mobile-menu behaviour
// are re-expressed in React (the reference ships that as site.js).

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our tuition" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
] as const;

const AREAS = [
  "Grays", "Tilbury", "Chafford Hundred", "Stanford-le-Hope", "Corringham",
  "South Ockendon", "Aveley", "West Thurrock", "Purfleet", "Chadwell St Mary",
  "North Stifford", "Orsett", "East Tilbury", "Badgers Dene",
] as const;

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Our services" },
  { href: "/services#subjects", label: "Subjects we teach" },
  { href: "/services#pricing", label: "Session pricing" },
  { href: "/about", label: "About us" },
  { href: "/about#mission", label: "Our mission" },
  { href: "/about#vision", label: "Our vision" },
  { href: "/contact", label: "Book an assessment" },
  { href: "/contact#faq", label: "FAQs" },
] as const;

const TUITION_LINKS = [
  { href: "/services#maths", label: "SATs preparation (KS2)" },
  { href: "/services#maths", label: "11+ entrance exams" },
  { href: "/services#subjects", label: "KS3 core support" },
  { href: "/services#maths", label: "GCSE Maths" },
  { href: "/services#english", label: "GCSE English" },
  { href: "/services#science", label: "GCSE Science" },
  { href: "/services#maths", label: "A-Level Maths" },
  { href: "/services#journey", label: "Progress tracking" },
  { href: "/services#journey", label: "Homework support" },
] as const;

function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Thurrock Tuition Academy home">
      <img src={`${basePath}/logo.svg`} alt="" width="51" height="57" />
      <div>
        <strong>Thurrock Tuition</strong>
        <span>ACADEMY</span>
      </div>
    </Link>
  );
}

function UtilityBar() {
  return (
    <div className="utility">
      <div className="wrap">
        <div className="utility-left">
          Learning starts with confidence.<span> &nbsp; Based in Grays, Thurrock.</span>
        </div>
        <div className="utility-right">
          <a href="tel:+447480413679">07480 413679</a>
          <Link href="/sign-in">Parent &amp; staff portal ↗</Link>
        </div>
      </div>
    </div>
  );
}

function Header({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close on route change — the reference closes the panel when a menu link
  // is followed.
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Escape closes the panel and restores focus to the toggle, matching site.js.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navLink = (href: string, label: string) => (
    <Link
      key={label}
      href={href}
      className={href === active ? "active" : undefined}
      aria-current={href === active ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <header className="header">
      <div className="wrap nav">
        <Brand />
        <nav className="navlinks" aria-label="Main navigation">
          {NAV_LINKS.map((l) => navLink(l.href, l.label))}
        </nav>
        <Link className="btn" href="/contact">
          Book a free assessment
          <ArrowIcon />
        </Link>
        <button
          ref={menuButton}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon />
        </button>
      </div>
      {/* The reference's mobile panel is an in-flow white panel under the
          header, not an off-canvas drawer. `open` mirrors its .open class. */}
      <nav
        className={open ? "mobile open" : "mobile"}
        id="mobile-menu"
        aria-label="Mobile navigation"
      >
        {NAV_LINKS.map((l) => navLink(l.href, l.label))}
        <Link className="btn" href="/contact">
          Book a free assessment
          <ArrowIcon />
        </Link>
      </nav>
    </header>
  );
}

// Shared on every public page, independently of the Contact page's own
// detailed find-us section.
export function RegionStrip() {
  return (
    <section className="location">
      <div className="wrap">
        <h3>
          Local tuition.<br />Across Thurrock.
        </h3>
        <div className="area-links">
          {AREAS.map((area) => (
            <Link key={area} href="/contact#find-us">
              {area}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <h2>
            A little support now.<br />A world of possibility ahead.
          </h2>
          <Link className="btn" href="/contact">
            Let&rsquo;s find their next step
            <ArrowIcon />
          </Link>
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              Expert Maths, English and Science tuition in Grays. Helping children
              across Thurrock build confidence, understand their subjects and take
              their next step.
            </p>
            <div className="actions">
              <a className="btn white" href="https://wa.me/447480413679">
                WhatsApp us
                <ArrowIcon />
              </a>
            </div>
          </div>
          <div>
            <h4>Explore the academy</h4>
            <ul>
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Tuition &amp; support</h4>
            <ul>
              {TUITION_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Come and say hello</h4>
            <p>
              Suite 1, Queensgate Centre<br />Orsett Road, Grays<br />Thurrock, Essex
            </p>
            <ul>
              <li>
                <a href="tel:+447480413679">07480 413679</a>
              </li>
              <li>
                <a href="mailto:bookings@thurrocktuitionacademy.co.uk">
                  bookings@thurrocktuitionacademy.co.uk
                </a>
              </li>
              <li>
                Monday–Saturday, 9am–6pm<br />Sunday: closed
              </li>
            </ul>
            <Link className="textlink" href="/sign-in">
              Parent &amp; staff portal ↗
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Thurrock Tuition Academy. All rights reserved.</span>
          <span>
            Registered in England &amp; Wales &nbsp; · &nbsp; DBS checked tutors &nbsp; · &nbsp;
            Website by <a href="https://launchflow.co.uk">LaunchFlow</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/**
 * Wraps a public page in the shared chrome. The `tta` class is what scopes
 * src/styles/tta-public.css — without it the page renders unstyled, and applied
 * anywhere else the admin dashboard would inherit the public design.
 */
export default function PublicShell({
  children,
  active,
  regionStrip = true,
  mainClassName,
}: {
  children: ReactNode;
  active: string;
  regionStrip?: boolean;
  /** The 404 view carries "wrap section" on <main> itself in the reference. */
  mainClassName?: string;
}) {
  return (
    <div className="tta">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <UtilityBar />
      <Header active={active} />
      <main id="main" className={mainClassName}>
        {children}
      </main>
      {regionStrip && <RegionStrip />}
      <Footer />
    </div>
  );
}
