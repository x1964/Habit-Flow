import type { Habit } from "@/types/habit";
import { calculateRecentDays } from "@/lib/habit-stats";
import { cn } from "@/lib/utils";

interface HabitCalendarProps {
  habits: Habit[];
}

export default function HabitCalendar({ habits }: HabitCalendarProps) {
  const recentDays = calculateRecentDays(habits);

  return (
    <section aria-labelledby="recent-activity-heading">
      <h2
        id="recent-activity-heading"
        className="font-display text-xl text-[var(--color-ink)]"
      >
        This week&apos;s chain
      </h2>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Mark the day, keep the chain unbroken.
      </p>

      <div className="shadow-card mt-4 grid grid-cols-7 gap-1.5 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:gap-3 sm:p-6">
        {recentDays.map((day) => {
          const status =
            day.completionRatio === null
              ? "none"
              : day.completionRatio >= 1
                ? "full"
                : day.completionRatio > 0
                  ? "partial"
                  : "empty";

          return (
            <div key={day.dateKey} className="flex flex-col items-center gap-2">
              <span className="font-mono-label text-[9px] text-[var(--color-ink-soft)] sm:text-[10px]">
                {day.label}
              </span>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-colors sm:h-11 sm:w-11",
                  status === "full" &&
                    "border-[var(--color-thread)] bg-[var(--color-thread)]/10",
                  status === "partial" &&
                    "border-[var(--color-thread)]/40 bg-transparent",
                  status === "empty" && "border-[var(--color-border)] bg-transparent",
                  status === "none" &&
                    "border-dashed border-[var(--color-border)] bg-transparent",
                  day.isToday && "outline outline-2 outline-offset-2 outline-[var(--color-ink)]"
                )}
                aria-label={`${day.label}: ${
                  status === "full"
                    ? "all habits marked"
                    : status === "partial"
                      ? "some habits marked"
                      : status === "empty"
                        ? "no habits marked"
                        : "no habits tracked"
                }`}
              >
                {status !== "none" && (
                  <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden="true">
                    <path
                      d="M3 3 L14 14 M14 3 L3 14"
                      stroke={
                        status === "full"
                          ? "var(--color-thread)"
                          : status === "partial"
                            ? "var(--color-thread)"
                            : "var(--color-border)"
                      }
                      strokeWidth={status === "full" ? 2.4 : 1.8}
                      strokeLinecap="round"
                      strokeDasharray={status === "empty" ? "1.5 2.5" : undefined}
                      opacity={status === "partial" ? 0.45 : 1}
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
