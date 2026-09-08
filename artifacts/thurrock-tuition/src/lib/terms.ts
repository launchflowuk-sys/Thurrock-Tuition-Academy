/**
 * UK school terms as the unit of time, not the calendar month.
 *
 * "This month" spans a two-week holiday and reports nonsense: a half-term in
 * the middle of October makes October's session count meaningless against
 * November's. Terms are the real periods a tuition centre runs on, so every
 * date range on the dashboard defaults to the current one.
 *
 * Term boundaries vary slightly by local authority. These are Thurrock's usual
 * pattern and are deliberately approximate — they are for labelling and
 * grouping, not for invoicing. If the academy publishes exact dates, replace
 * TERM_PATTERN with them (ideally moved into the settings table so the office
 * can edit them without a deploy).
 */

export interface Term {
  label: string;
  start: Date;
  end: Date;
  week: number;
  totalWeeks: number;
}

interface TermShape {
  label: string;
  /** [month (0-based), day] */
  start: [number, number];
  end: [number, number];
}

const TERM_PATTERN: TermShape[] = [
  { label: "Autumn term", start: [8, 1], end: [11, 20] },   // Sep 1 – Dec 20
  { label: "Spring term", start: [0, 4], end: [2, 31] },    // Jan 4 – Mar 31
  { label: "Summer term", start: [3, 15], end: [6, 22] },   // Apr 15 – Jul 22
];

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function weeksBetween(from: Date, to: Date): number {
  return Math.max(1, Math.ceil((to.getTime() - from.getTime()) / MS_PER_WEEK));
}

export function currentTerm(now: Date): Term {
  const year = now.getFullYear();

  for (const shape of TERM_PATTERN) {
    const start = new Date(year, shape.start[0], shape.start[1]);
    const end = new Date(year, shape.end[0], shape.end[1]);
    if (now >= start && now <= end) {
      return {
        label: shape.label,
        start,
        end,
        week: weeksBetween(start, now),
        totalWeeks: weeksBetween(start, end),
      };
    }
  }

  // Between terms — a holiday. Report it rather than pretending a term is
  // running, because "week 0 of 16" is worse than "holiday".
  return {
    label: "School holiday",
    start: now,
    end: now,
    week: 0,
    totalWeeks: 0,
  };
}

/**
 * A quiet exam countdown. GCSE and A-level dates are fixed and public, which
 * turns the dashboard into something looked at daily rather than weekly.
 *
 * These are the usual start of the main summer exam window. Confirm against
 * the current JCQ timetable before the business relies on the exact day.
 */
const EXAM_WINDOWS = [
  { label: "GCSE summer exams", month: 4, day: 8 }, // ~8 May
  { label: "A-level summer exams", month: 4, day: 12 }, // ~12 May
  { label: "KS2 SATs week", month: 4, day: 11 }, // ~11 May
];

export interface ExamCountdown {
  headline: string;
  subtitle: string;
  detail: string;
}

export function examCountdown(now: Date): ExamCountdown {
  const candidates = EXAM_WINDOWS.flatMap((w) => {
    // Take this year's date if it is still ahead, otherwise next year's.
    const thisYear = new Date(now.getFullYear(), w.month, w.day);
    const date = thisYear >= now ? thisYear : new Date(now.getFullYear() + 1, w.month, w.day);
    return [{ ...w, date }];
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const next = candidates[0];
  const days = Math.ceil((next.date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

  return {
    headline: `${days} days`,
    subtitle: next.label,
    detail: next.date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}
