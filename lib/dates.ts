// Dates are stored as "YYYY-MM" (e.g. "2025-11"). Older entries were typed as
// free text like "2025 November" or "Nov 2025", so everything here also
// accepts those and converts them, instead of showing them half-parsed.

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Converts "2025-11", "2025 November", "Nov 2025", "November, 2025" … to "2025-11".
 *  Returns "" for empty input, or the trimmed input if it can't be understood. */
export function toYearMonth(input?: string): string {
  const s = (input ?? "").trim();
  if (!s) return "";
  const iso = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}`;
  const year = s.match(/\b(\d{4})\b/)?.[1];
  const word = s.toLowerCase().match(/[a-z]{3,}/)?.[0];
  const month = word ? MONTHS.indexOf(word.slice(0, 3)) : -1;
  if (year && month >= 0) return `${year}-${String(month + 1).padStart(2, "0")}`;
  if (year && /^\d{4}$/.test(s)) return year;
  return s;
}

/** "2025-11" → "Nov 2025"; empty → "Present". */
export function formatYearMonth(input?: string): string {
  const ym = toYearMonth(input);
  if (!ym) return "Present";
  const m = ym.match(/^(\d{4})-(\d{2})$/);
  if (!m) return ym; // year only, or text we couldn't parse: show as-is
  return `${LABELS[Number(m[2]) - 1]} ${m[1]}`;
}

type Dated = { startDate: string; endDate?: string };

/** Newest first. No end date ("Present") counts as the latest; ties fall back
 *  to the latest start date. */
export function byRecency(a: Dated, b: Dated): number {
  const endA = toYearMonth(a.endDate) || "9999-12";
  const endB = toYearMonth(b.endDate) || "9999-12";
  if (endA !== endB) return endB.localeCompare(endA);
  return toYearMonth(b.startDate).localeCompare(toYearMonth(a.startDate));
}
