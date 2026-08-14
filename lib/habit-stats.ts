import type { Habit } from "@/types/habit";
import { dateKeyDaysAgo, todayKey, weekdayLabel } from "@/lib/utils";
import { RECENT_DAYS_COUNT } from "@/lib/constants";

/** Whether the habit has been completed for the given date key (defaults to today). */
export function isCompletedOn(habit: Habit, dateKey: string = todayKey()): boolean {
  return habit.completions.includes(dateKey);
}

/**
 * Calculates the current consecutive-day streak for a habit, counting
 * backwards from today. If today is not completed, the streak is based on
 * yesterday backwards (a "grace" streak) UNLESS the habit has never been
 * completed, in which case it's 0. If neither today nor yesterday is
 * completed, the streak is 0.
 */
export function calculateStreak(habit: Habit): number {
  const completed = new Set(habit.completions);
  if (completed.size === 0) return 0;

  const completedToday = completed.has(todayKey());
  const completedYesterday = completed.has(dateKeyDaysAgo(1));

  // If neither today nor yesterday was completed, the streak is broken.
  if (!completedToday && !completedYesterday) return 0;

  // Start counting from today if it's completed, otherwise from yesterday.
  const startOffset = completedToday ? 0 : 1;

  let streak = 0;
  let offset = startOffset;
  while (completed.has(dateKeyDaysAgo(offset))) {
    streak += 1;
    offset += 1;
  }
  return streak;
}

/** Best (longest) streak ever achieved for a single habit. */
export function calculateBestStreak(habit: Habit): number {
  if (habit.completions.length === 0) return 0;
  const sorted = [...habit.completions].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      current += 1;
    } else if (diffDays > 1) {
      current = 1;
    }
    best = Math.max(best, current);
  }
  return best;
}

export interface TodayProgress {
  completed: number;
  total: number;
  percent: number;
}

export function calculateTodayProgress(habits: Habit[]): TodayProgress {
  const total = habits.length;
  const completed = habits.filter((h) => isCompletedOn(h)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}

/** The overall streak shown in the summary: the best current streak among all habits. */
export function calculateOverallStreak(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  return Math.max(...habits.map(calculateStreak));
}

export interface RecentDay {
  dateKey: string;
  label: string;
  isToday: boolean;
  /** Fraction (0-1) of habits completed on this day; null if there were no habits yet. */
  completionRatio: number | null;
}

/** Builds the last `RECENT_DAYS_COUNT` days (oldest first) with completion ratios. */
export function calculateRecentDays(
  habits: Habit[],
  days: number = RECENT_DAYS_COUNT
): RecentDay[] {
  const today = todayKey();
  const result: RecentDay[] = [];

  for (let offset = days - 1; offset >= 0; offset--) {
    const dateKey = dateKeyDaysAgo(offset);
    const eligibleHabits = habits.filter((h) => h.createdAt <= endOfDay(dateKey));
    const completionRatio =
      eligibleHabits.length === 0
        ? null
        : eligibleHabits.filter((h) => h.completions.includes(dateKey)).length /
          eligibleHabits.length;

    result.push({
      dateKey,
      label: weekdayLabel(dateKey),
      isToday: dateKey === today,
      completionRatio,
    });
  }

  return result;
}

function endOfDay(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
}
