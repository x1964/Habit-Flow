"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Habit, HabitFormData } from "@/types/habit";
import { STORAGE_KEY } from "@/lib/constants";
import { generateId, todayKey } from "@/lib/utils";

function isValidHabit(value: unknown): value is Habit {
  if (typeof value !== "object" || value === null) return false;
  const h = value as Record<string, unknown>;
  return (
    typeof h.id === "string" &&
    typeof h.name === "string" &&
    typeof h.category === "string" &&
    typeof h.icon === "string" &&
    Array.isArray(h.completions) &&
    h.completions.every((c) => typeof c === "string") &&
    typeof h.createdAt === "number"
  );
}

function parseStoredHabits(raw: string | null): Habit[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidHabit);
  } catch {
    return [];
  }
}

const EMPTY_HABITS: Habit[] = [];

// Cache the last-read snapshot so useSyncExternalStore doesn't think the
// store changed on every render (it compares by reference).
let cachedRaw: string | null | undefined;
let cachedHabits: Habit[] = EMPTY_HABITS;

function readSnapshot(): Habit[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedHabits;
  cachedRaw = raw;
  cachedHabits = parseStoredHabits(raw);
  return cachedHabits;
}

function getSnapshot(): Habit[] {
  return readSnapshot();
}

function getServerSnapshot(): Habit[] {
  return EMPTY_HABITS;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function writeHabits(next: Habit[]): void {
  cachedHabits = next;
  cachedRaw = JSON.stringify(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // Storage may be unavailable (private mode, quota exceeded, etc.)
    // The in-memory cache still reflects the change for this session.
  }
  // Notify same-tab listeners (the native "storage" event only fires for
  // other tabs), so re-render this tab too.
  window.dispatchEvent(new Event("storage"));
}

export function useHabits() {
  const habits = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // On the server (and before hydration completes) we render an empty list;
  // isLoaded flips true once we're on the client and have a real snapshot.
  const isLoaded = typeof window !== "undefined";

  const addHabit = useCallback((data: HabitFormData) => {
    const name = data.name.trim();
    if (!name) return;
    const newHabit: Habit = {
      id: generateId(),
      name,
      category: data.category,
      icon: data.icon,
      completions: [],
      createdAt: Date.now(),
    };
    writeHabits([...readSnapshot(), newHabit]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    writeHabits(readSnapshot().filter((h) => h.id !== id));
  }, []);

  const toggleCompletion = useCallback((id: string, dateKey: string = todayKey()) => {
    writeHabits(
      readSnapshot().map((h) => {
        if (h.id !== id) return h;
        const isCompleted = h.completions.includes(dateKey);
        return {
          ...h,
          completions: isCompleted
            ? h.completions.filter((c) => c !== dateKey)
            : [...h.completions, dateKey].sort(),
        };
      })
    );
  }, []);

  return { habits, isLoaded, addHabit, deleteHabit, toggleCompletion };
}
