/**
 * Centralized date logic. All dates are handled as *local calendar dates*
 * (not UTC/timestamps) so streaks and "today" behave correctly regardless
 * of timezone.
 */

/** Returns a local ISO date key, e.g. "2026-08-14", for the given Date (defaults to now). */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's local date key. */
export function todayKey(): string {
  return toDateKey(new Date());
}

/** Returns the date key for `offset` days before today (offset >= 0). */
export function dateKeyDaysAgo(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return toDateKey(d);
}

/** Parses a "YYYY-MM-DD" key into a local Date at midnight. */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** Short weekday label, e.g. "MON", for a given date key. */
export function weekdayLabel(key: string): string {
  const labels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return labels[parseDateKey(key).getDay()];
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
