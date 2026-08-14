"use client";

import { useState } from "react";
import { useHabits } from "@/hooks/use-habits";
import ProgressSummary from "@/components/habit/progress-summary";
import HabitList from "@/components/habit/habit-list";
import HabitCalendar from "@/components/habit/habit-calendar";
import AddHabitModal from "@/components/habit/add-habit-modal";
import EmptyState from "@/components/habit/empty-state";

function EmbroideryHoop() {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      aria-hidden="true"
      className="shrink-0"
      style={{ animation: "float-slow 6s ease-in-out infinite" }}
    >
      {/* outer hoop */}
      <circle cx="44" cy="44" r="38" fill="none" stroke="var(--color-thread-gold-deep)" strokeWidth="4" />
      <circle cx="44" cy="44" r="38" fill="none" stroke="var(--color-thread-gold)" strokeWidth="1.5" opacity="0.6" />
      {/* screw clasp */}
      <rect x="60" y="4" width="8" height="14" rx="2" fill="var(--color-thread-gold-deep)" />
      {/* inner hoop / fabric edge */}
      <circle cx="44" cy="44" r="30" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
      {/* stitched cross marks scattered inside */}
      {[
        [30, 34],
        [44, 28],
        [56, 40],
        [34, 52],
        [50, 56],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x - 4} ${y - 4} L${x + 4} ${y + 4} M${x + 4} ${y - 4} L${x - 4} ${y + 4}`}
          stroke="var(--color-thread)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.85 - i * 0.08}
        />
      ))}
    </svg>
  );
}

export default function HabitDashboard() {
  const { habits, isLoaded, addHabit, deleteHabit, toggleCompletion } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5">
            <EmbroideryHoop />
            <div>
              <p className="font-mono-label text-[10px] uppercase text-[var(--color-ink-soft)]">
                Don&apos;t break the chain
              </p>
              <h1 className="font-display mt-1 text-4xl italic tracking-tight text-[var(--color-ink)] sm:text-5xl">
                Habit Flow
              </h1>
              <svg width="150" height="8" viewBox="0 0 150 8" className="mt-2" aria-hidden="true">
                {Array.from({ length: 15 }).map((_, i) => (
                  <line
                    key={i}
                    x1={i * 10 + 1}
                    y1="4"
                    x2={i * 10 + 7}
                    y2="4"
                    stroke="var(--color-thread)"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shadow-card inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-surface)] transition-all hover:bg-[var(--color-thread-deep)] hover:shadow-card-hover active:scale-[0.98]"
          >
            <span className="text-base leading-none">+</span>
            Start a thread
          </button>
        </header>

        {!isLoaded ? (
          <div
            aria-hidden
            className="h-40 animate-pulse rounded-3xl bg-[var(--color-surface-deep)]"
          />
        ) : habits.length === 0 ? (
          <EmptyState onAddHabit={() => setIsModalOpen(true)} />
        ) : (
          <>
            <ProgressSummary habits={habits} />
            <HabitList habits={habits} onToggle={toggleCompletion} onDelete={deleteHabit} />
            <HabitCalendar habits={habits} />
          </>
        )}
      </div>

      {isModalOpen && (
        <AddHabitModal
          onClose={() => setIsModalOpen(false)}
          onAdd={(data) => {
            addHabit(data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
