export type HabitCategory =
  | "health"
  | "learning"
  | "fitness"
  | "personal"
  | "work"
  | "other";

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  /** ISO date keys, e.g. "2026-08-14" */
  completions: string[];
  createdAt: number;
}

export type HabitFormData = {
  name: string;
  category: HabitCategory;
  icon: string;
};
