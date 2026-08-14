import type { Habit } from "@/types/habit";
import { calculateOverallStreak, calculateTodayProgress, isCompletedOn } from "@/lib/habit-stats";
import StreakSpool from "@/components/habit/streak-spool";
import { cn } from "@/lib/utils";

interface ProgressSummaryProps {
  habits: Habit[];
}

function CrossMark({ done, delay }: { done: boolean; delay: number }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      aria-hidden="true"
      style={done ? { animation: "mark-in 0.35s cubic-bezier(0.34,1.56,0.64,1)", animationDelay: `${delay}ms`, animationFillMode: "backwards" } : undefined}
    >
      <path
        d="M2.5 2.5 L12.5 12.5 M12.5 2.5 L2.5 12.5"
        stroke={done ? "var(--color-thread)" : "var(--color-border)"}
        strokeWidth={done ? 2.4 : 1.6}
        strokeLinecap="round"
        strokeDasharray={done ? undefined : "1.5 2.5"}
      />
    </svg>
  );
}

export default function ProgressSummary({ habits }: ProgressSummaryProps) {
  const { completed, total, percent } = calculateTodayProgress(habits);
  const bestStreak = calculateOverallStreak(habits);

  return (
    <section
      aria-label="Today's progress"
      className="shadow-card rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-7 sm:px-9 sm:py-8"
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono-label text-[10px] uppercase text-[var(--color-ink-soft)]">
            Today&apos;s sampler
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-5">
            <div
              className="flex flex-wrap gap-2"
              role="img"
              aria-label={`${completed} of ${total} habits marked today`}
            >
              {habits.map((habit, index) => (
                <span
                  key={habit.id}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    isCompletedOn(habit) ? "bg-[var(--color-thread)]/10" : "bg-transparent"
                  )}
                >
                  <CrossMark done={isCompletedOn(habit)} delay={index * 35} />
                </span>
              ))}
            </div>
            <div className="border-l border-[var(--color-border)] pl-5">
              <p className="font-display text-3xl leading-none text-[var(--color-ink)]">
                {completed}
                <span className="text-[var(--color-ink-soft)]"> / {total}</span>
              </p>
              <p className="font-mono-label mt-1.5 text-[10px] uppercase text-[var(--color-ink-soft)]">
                {percent}% marked
              </p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[var(--color-border)] sm:h-16 sm:w-px" />

        <div className="flex items-center gap-4">
          <StreakSpool streak={bestStreak} size="lg" />
          <div>
            <p className="font-mono-label text-[10px] uppercase text-[var(--color-ink-soft)]">
              Longest streak
            </p>
            <p className="font-display mt-1 text-3xl leading-none text-[var(--color-ink)]">
              {bestStreak}
              <span className="ml-1.5 text-base text-[var(--color-ink-soft)]">
                {bestStreak === 1 ? "day" : "days"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
