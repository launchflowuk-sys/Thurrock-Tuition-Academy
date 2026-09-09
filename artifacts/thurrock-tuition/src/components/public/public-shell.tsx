import { type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowIcon } from "./icons";
import SiteNav from "./site-nav";
import CookieBanner, { CookieSettingsLink } from "./cookie-banner";

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
    <Link className="brand" href="/">
      <img src={`${basePath}/logo-mark-96.webp`} alt="" width="46" height="46" decoding="async" />
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
            <h3>Explore the academy</h3>
            <ul>
              {EXPLORE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Tuition &amp; support</h3>
            <ul>
              {TUITION_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Come and say hello</h3>
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
            <Link href="/privacy">Privacy &amp; cookies</Link> &nbsp; · &nbsp;
            {/* A visitor must be able to withdraw consent as easily as they gave
                it, which means a permanent way back to the banner. */}
            <CookieSettingsLink /> &nbsp; · &nbsp; DBS checked tutors &nbsp; · &nbsp;
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
      <SiteNav active={active} />
      <main id="main" className={mainClassName}>
        {children}
      </main>
      {regionStrip && <RegionStrip />}
      <Footer />
      {/* Last in the tree but fixed to the viewport, so it sits over the footer
          rather than being clipped by any section's stacking context. */}
      <CookieBanner />
    </div>
  );
}
