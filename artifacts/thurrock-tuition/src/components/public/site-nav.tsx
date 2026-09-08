import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowIcon, BookIcon, PeopleIcon, PinIcon, ProgressIcon, ShieldIcon } from "./icons";

/**
 * Site navigation: desktop mega menu + mobile drawer.
 *
 * ── The mega-menu bug this is written to avoid ───────────────────────────────
 * The usual implementation hangs onMouseEnter/onMouseLeave off the *trigger*
 * link. The panel renders below it, so the instant the cursor leaves the link
 * to travel down into the panel, mouseleave fires and the panel disappears —
 * the menu looks fine until you try to click something in it, then it is
 * unusable. Adding a close delay alone does not fix it either; it just makes
 * the disappearance feel random.
 *
 * Three things fix it properly, and all three are needed:
 *
 *   1. ONE hover region. The triggers and the panel live inside a single
 *      wrapper, and the mouse handlers are on that wrapper — not on the links.
 *      Moving from a trigger into the panel never leaves the wrapper, so no
 *      close event is raised at all. This is the structural fix.
 *   2. NO DEAD GAP. The panel is flush to the bottom of the header
 *      (top: 100%). Any visual breathing room is padding *inside* the panel,
 *      so there is no strip of non-hoverable page between the two.
 *   3. A short close delay, cancelled on re-entry. Covers diagonal cursor
 *      paths across a neighbouring trigger and sub-pixel exits at the seam.
 *
 * Keyboard and touch get first-class treatment too: focus opens, Escape
 * closes and restores focus, and coarse pointers use tap instead of hover
 * (hover on touch means the first tap opens and the second navigates, which
 * feels broken).
 */

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const WHATSAPP = "https://wa.me/447480413679";
const PHONE = "+447480413679";
const PHONE_DISPLAY = "07480 413679";

interface MenuLink {
  href: string;
  label: string;
  hint?: string;
}

interface MenuColumn {
  heading: string;
  links: MenuLink[];
}

interface NavItem {
  href: string;
  label: string;
  columns?: MenuColumn[];
  feature?: { title: string; body: string; href: string; cta: string };
}

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/services",
    label: "Our tuition",
    columns: [
      {
        heading: "By stage",
        links: [
          { href: "/services#maths", label: "SATs preparation", hint: "Years 5–6" },
          { href: "/services#maths", label: "11+ entrance exams", hint: "Grammar & independent" },
          { href: "/services#subjects", label: "KS3 core support", hint: "Years 7–9" },
          { href: "/services#maths", label: "GCSE", hint: "Years 10–11" },
          { href: "/services#maths", label: "A-Level Maths", hint: "Sixth form" },
        ],
      },
      {
        heading: "By subject",
        links: [
          { href: "/services#maths", label: "Mathematics", hint: "Number bonds to calculus" },
          { href: "/services#english", label: "English", hint: "Language & Literature" },
          { href: "/services#science", label: "Science", hint: "Biology, Chemistry, Physics" },
        ],
      },
      {
        heading: "How it works",
        links: [
          { href: "/services#journey", label: "The TTA journey" },
          { href: "/services#pricing", label: "Session pricing" },
          { href: "/services#faq", label: "Tuition FAQs" },
        ],
      },
    ],
    feature: {
      title: "Start with a free assessment",
      body: "A baseline test, a conversation with you, a personal learning plan and written targets. No obligation.",
      href: "/contact",
      cta: "Book the assessment",
    },
  },
  {
    href: "/about",
    label: "About us",
    columns: [
      {
        heading: "The academy",
        links: [
          { href: "/about", label: "Our story" },
          { href: "/about#mission", label: "Our mission" },
          { href: "/about#vision", label: "Our vision" },
        ],
      },
      {
        heading: "How we teach",
        links: [
          { href: "/about", label: "Meet the team" },
          { href: "/about", label: "Our values" },
          { href: "/services#journey", label: "Progress you can follow" },
        ],
      },
    ],
    feature: {
      title: "Qualified, DBS checked",
      body: "Small groups of no more than eight students, taught by qualified teachers in Grays.",
      href: "/about",
      cta: "Get to know us",
    },
  },
  { href: "/contact", label: "Contact" },
];

const AREAS = [
  "Grays", "Tilbury", "Chafford Hundred", "Stanford-le-Hope",
  "Corringham", "South Ockendon", "Aveley", "West Thurrock",
];

/** Matches the CSS transition duration; keep the two in step. */
const CLOSE_DELAY_MS = 140;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/">
      <img
        src={`${basePath}/logo-mark-96.webp`}
        alt=""
        width={compact ? 40 : 46}
        height={compact ? 40 : 46}
        decoding="async"
      />
      <div>
        <strong>Thurrock Tuition</strong>
        <span>ACADEMY</span>
      </div>
    </Link>
  );
}

/* ─────────────────────────── Desktop mega menu ─────────────────────────── */

function MegaTriggers({
  active,
  openIndex,
  onOpen,
}: {
  active: string;
  openIndex: number | null;
  onOpen: (i: number | null) => void;
}) {
  return (
    <nav className="navlinks" aria-label="Main navigation">
      {NAV.map((item, i) => {
        const isActive = item.href === active;
        const hasPanel = Boolean(item.columns);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={isActive ? "active" : undefined}
            aria-current={isActive ? "page" : undefined}
            aria-expanded={hasPanel ? openIndex === i : undefined}
            aria-haspopup={hasPanel || undefined}
            onMouseEnter={() => onOpen(hasPanel ? i : null)}
            onFocus={() => onOpen(hasPanel ? i : null)}
          >
            {item.label}
            {hasPanel && (
              <svg
                className={openIndex === i ? "chev open" : "chev"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function MegaPanel({
  openIndex,
  onClose,
}: {
  openIndex: number | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const open = openIndex !== null ? NAV[openIndex] : null;

  return (
    <>
      <AnimatePresence>
        {open?.columns && (
          <motion.div
            className="mega"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="wrap mega-inner">
              <div className="mega-cols">
                {open.columns.map((col) => (
                  <div key={col.heading} className="mega-col">
                    <h4>{col.heading}</h4>
                    <ul>
                      {col.links.map((l) => (
                        <li key={l.label + l.href}>
                          <Link href={l.href} onClick={onClose}>
                            <span>{l.label}</span>
                            {l.hint && <small>{l.hint}</small>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {open.feature && (
                <div className="mega-feature">
                  <h4>{open.feature.title}</h4>
                  <p>{open.feature.body}</p>
                  <Link className="btn" href={open.feature.href} onClick={onClose}>
                    {open.feature.cta}
                    <ArrowIcon />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────────────────────── Mobile drawer ───────────────────────────── */

function MobileDrawer({
  open,
  onClose,
  active,
}: {
  open: boolean;
  onClose: () => void;
  active: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDX = useRef(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Escape closes; the page behind must not scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // The drawer stays mounted and is animated with CSS transitions rather than
  // Motion. Motion's initial/animate on `x` repeatedly left the panel parked
  // at translateX(100%) — fully off-screen, looking like the drawer simply
  // never opened. A class toggle plus a transform transition cannot get stuck
  // in a half-applied state, costs no JS per frame, and keeps the panel out of
  // the accessibility tree while closed via `inert`.
  return (
    <>
      <button
        type="button"
        className={open ? "drawer-scrim open" : "drawer-scrim"}
        aria-label="Close menu"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
      />
      <div
        ref={panel}
        className={open ? "drawer open" : "drawer"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        {...(open ? {} : { inert: "" as unknown as boolean })}
        // Swipe right to dismiss — the gesture expected of a right-hand drawer.
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchDX.current = 0;
        }}
        onTouchMove={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.touches[0].clientX - touchStartX.current;
          if (dx > 0) {
            touchDX.current = dx;
            e.currentTarget.style.transform = `translateX(${dx}px)`;
            e.currentTarget.style.transition = "none";
          }
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.transition = "";
          if (touchDX.current > 80) onClose();
          touchStartX.current = null;
          touchDX.current = 0;
        }}
      >
            <div className="drawer-head">
              <img
                src={`${basePath}/logo-badge-96.webp`}
                alt=""
                width="52"
                height="52"
                decoding="async"
              />
              <div>
                <strong>Thurrock Tuition</strong>
                <span>ACADEMY</span>
              </div>
              <button type="button" className="drawer-close" onClick={onClose} aria-label="Close menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="drawer-body">
              <nav aria-label="Mobile navigation">
                {NAV.map((item, i) => {
                  const isActive = item.href === active;
                  if (!item.columns) {
                    return (
                      <Link
                        key={item.label}
                        className={isActive ? "drawer-link active" : "drawer-link"}
                        href={item.href}
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    );
                  }
                  const isOpen = expanded === i;
                  return (
                    <div key={item.label} className="drawer-group">
                      <button
                        type="button"
                        className={isOpen ? "drawer-link is-open" : "drawer-link"}
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : i)}
                      >
                        {item.label}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      <div className={isOpen ? "drawer-collapse open" : "drawer-collapse"}>
                        <div className="drawer-collapse-inner">
                          <div className="drawer-sub">
                            <Link href={item.href} onClick={onClose}>
                              All {item.label.toLowerCase()}
                            </Link>
                            {item.columns.flatMap((c) => c.links).map((l, k) => (
                              <Link key={l.label + k} href={l.href} onClick={onClose}>
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </nav>

              <div className="drawer-actions">
                <Link className="btn" href="/contact" onClick={onClose}>
                  Book a free assessment
                  <ArrowIcon />
                </Link>
                <a className="btn wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
                  WhatsApp us
                </a>
                <a className="btn outline" href={`tel:${PHONE}`}>
                  <PhoneIcon />
                  {PHONE_DISPLAY}
                </a>
              </div>

              <div className="drawer-facts">
                <div><ShieldIcon /><span>Qualified, DBS checked</span></div>
                <div><PeopleIcon /><span>Maximum of 8 per session</span></div>
                <div><BookIcon /><span>SATs through to A-Level</span></div>
                <div><ProgressIcon /><span>Progress you can follow</span></div>
              </div>

              <div className="drawer-areas">
                <h4><PinIcon /> Serving all of Thurrock</h4>
                <div>
                  {AREAS.map((a) => (
                    <Link key={a} href="/contact#find-us" onClick={onClose}>{a}</Link>
                  ))}
                </div>
              </div>

              <Link className="drawer-portal" href="/sign-in" onClick={onClose}>
                Parent &amp; staff portal ↗
              </Link>
            </div>
      </div>
    </>
  );
}

/* ──────────────────────────────── Header ───────────────────────────────── */

export default function SiteNav({ active }: { active: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [location] = useLocation();
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    setDrawerOpen(false);
    setOpenIndex(null);
  }, [location]);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), CLOSE_DELAY_MS);
  };

  const openPanel = (i: number | null) => {
    cancelClose();
    setOpenIndex(i);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex]);

  return (
    // The <header> IS the hover region — it contains the trigger row, the strip
    // of chrome below it, and the panel. Travelling from a trigger down into
    // the panel therefore never leaves this element, so no close is raised.
    // Hanging these handlers off the links (or off a display:contents wrapper,
    // which generates no box at all) is what makes mega menus unclickable.
    <header
      className="header"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpenIndex(null);
        }
      }}
    >
      <div className="wrap nav">
        <Brand />
        <MegaTriggers active={active} openIndex={openIndex} onOpen={openPanel} />
        <div className="nav-actions">
          <a className="nav-wa" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp">
            <WhatsAppIcon />
          </a>
          <Link className="btn" href="/contact">
            Book a free assessment
            <ArrowIcon />
          </Link>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-expanded={drawerOpen}
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
        >
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      <MegaPanel openIndex={openIndex} onClose={() => setOpenIndex(null)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={active} />
    </header>
  );
}
