import type { ReactNode } from "react";
import { Link } from "wouter";

/**
 * The three primitives the dashboard is built from: the KPI card, the white
 * content panel and the solid status pill. Get these right and most screens
 * follow. Styling lives in src/styles/dashboard.css.
 */

export type Ground = "navy" | "cobalt" | "purple" | "teal" | "coral" | "amber";

/**
 * A KPI card is ~176px of usable width at four-up, and at 44px the digits run
 * roughly 0.53em each — so anything past seven characters is clipped by the
 * card's own overflow-hidden. Stepping the size down is not cosmetic: a money
 * figure clipped from £1,544.40 to £1,544.4 is a different number, and nothing
 * errors.
 */
function figureClass(value: string): string {
  const n = value.length;
  if (n >= 13) return "kpi-figure len-13";
  if (n >= 10) return "kpi-figure len-10";
  if (n >= 8) return "kpi-figure len-8";
  return "kpi-figure";
}

export function Kpi({
  label,
  value,
  note,
  ground,
  href,
}: {
  label: string;
  value: string;
  note?: string;
  ground: Ground;
  /** When the figure names things a person should act on, link straight to them. */
  href?: string;
}) {
  const inner = (
    <>
      <p className="kpi-label">{label}</p>
      <div>
        <p className={figureClass(value)}>{value}</p>
        {note && <p className="kpi-note">{note}</p>}
      </div>
    </>
  );
  const className = `kpi kpi-${ground}`;
  return href ? (
    <Link className={className} href={href}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      {(title || actions) && (
        <div className="panel-head">
          <div>
            {title && <h2 className="panel-title">{title}</h2>}
            {subtitle && <p className="panel-sub">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Pill({
  children,
  ground = "grey",
}: {
  children: ReactNode;
  ground?: Ground | "grey";
}) {
  return <span className={`pill pill-${ground}`}>{children}</span>;
}

/**
 * Attendance as a strip, not a number: one mark per week of term, filled when
 * the student attended. A pattern of absence is visible at a glance in a way a
 * percentage never is.
 *
 * Colour follows the progress-bar rule — red below 34%, amber below 67%,
 * green above.
 */
export function AttendanceStrip({ weeks }: { weeks: boolean[] }) {
  const attended = weeks.filter(Boolean).length;
  const pct = weeks.length ? (attended / weeks.length) * 100 : 0;
  const ground = pct < 34 ? "coral" : pct < 67 ? "amber" : "teal";
  return (
    <span
      className={`attendance attendance-${ground}`}
      aria-label={`Attended ${attended} of ${weeks.length} weeks`}
    >
      {weeks.map((present, i) => (
        <i key={i} className={present ? "on" : undefined} aria-hidden="true" />
      ))}
    </span>
  );
}
