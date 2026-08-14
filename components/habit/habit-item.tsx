"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { HABIT_CATEGORIES } from "@/lib/constants";
import { calculateStreak, isCompletedOn } from "@/lib/habit-stats";
import StreakSpool from "@/components/habit/streak-spool";
import { cn } from "@/lib/utils";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitItem({ habit, onToggle, onDelete }: HabitItemProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const completed = isCompletedOn(habit);
  const streak = calculateStreak(habit);
  const categoryLabel =
    HABIT_CATEGORIES.find((c) => c.value === habit.category)?.label ?? "Other";

  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-2xl border bg-[var(--color-surface)] p-4 shadow-card transition-all duration-200 hover:shadow-card-hover",
        completed ? "border-[var(--color-thread)]/35" : "border-[var(--color-border)]"
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(habit.id)}
        aria-pressed={completed}
        aria-label={
          completed
            ? `Unmark "${habit.name}" for today`
            : `Mark "${habit.name}" done for today`
        }
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all active:scale-90",
          completed
            ? "border-[var(--color-thread)] bg-[var(--color-thread)]"
            : "border-[var(--color-border)] bg-[var(--color-canvas)] hover:border-[var(--color-thread)]"
        )}
      >
        {completed && (
          <svg
            viewBox="0 0 20 20"
            width="16"
            height="16"
            aria-hidden="true"
            style={{ animation: "mark-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            <path
              d="M5 5 L15 15 M15 5 L5 15"
              stroke="var(--color-surface)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-deep)] text-sm leading-none"
          >
            {habit.icon}
          </span>
          <p
            className={cn(
              "truncate text-[15px] font-medium text-[var(--color-ink)]",
              completed && "text-[var(--color-ink-soft)]"
            )}
          >
            {habit.name}
          </p>
        </div>
        <p className="font-mono-label mt-1.5 pl-9 text-[10px] uppercase text-[var(--color-ink-soft)]">
          {categoryLabel}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {streak > 0 && (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <StreakSpool streak={streak} size="sm" />
            <span className="font-display whitespace-nowrap text-sm text-[var(--color-ink-soft)]">
              {streak}d
            </span>
          </div>
        )}

        {confirmingDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onDelete(habit.id);
                setConfirmingDelete(false);
              }}
              className="rounded-full bg-[var(--color-mark-red)]/10 px-2.5 py-1 text-xs font-medium text-[var(--color-mark-red)] transition-colors hover:bg-[var(--color-mark-red)]/20"
            >
              Cut it
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-deep)]"
            >
              Keep
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label={`Cut the thread for "${habit.name}"`}
            className="rounded-full p-1.5 text-[var(--color-ink-soft)] opacity-0 transition-all hover:bg-[var(--color-surface-deep)] hover:text-[var(--color-mark-red)] focus-visible:opacity-100 group-hover:opacity-100"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
