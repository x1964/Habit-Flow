import type { HabitCategory } from "@/types/habit";

export const STORAGE_KEY = "habit-tracker-data";

export const HABIT_CATEGORIES: { value: HabitCategory; label: string }[] = [
  { value: "health", label: "Health" },
  { value: "learning", label: "Learning" },
  { value: "fitness", label: "Fitness" },
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export const HABIT_ICONS: string[] = ["📚", "🏃", "💧", "🧘", "💻", "🎯", "📝", "❤️"];

export const DEFAULT_ICON = HABIT_ICONS[0];
export const DEFAULT_CATEGORY: HabitCategory = "personal";

export const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** Number of days (including today) shown in the recent activity calendar. */
export const RECENT_DAYS_COUNT = 7;
