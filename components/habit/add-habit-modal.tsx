"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { HabitCategory, HabitFormData } from "@/types/habit";
import { DEFAULT_CATEGORY, DEFAULT_ICON, HABIT_CATEGORIES, HABIT_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AddHabitModalProps {
  onClose: () => void;
  onAdd: (data: HabitFormData) => void;
}

export default function AddHabitModal({ onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<HabitCategory>(DEFAULT_CATEGORY);
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const nameFieldId = useId();
  const categoryFieldId = useId();

  useEffect(() => {
    nameInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Give your habit a name.");
      nameInputRef.current?.focus();
      return;
    }
    onAdd({ name: trimmed, category, icon });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] p-0 sm:items-center sm:p-4"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-md rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card-hover animate-[modal-in_0.2s_ease-out] sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <h2 id={headingId} className="font-display text-xl italic text-[var(--color-ink)]">
            Start a thread
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-deep)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor={nameFieldId}
              className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
            >
              Habit name
            </label>
            <input
              id={nameFieldId}
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Read for 20 minutes"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${nameFieldId}-error` : undefined}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-soft)] focus:border-[var(--color-thread)]"
            />
            {error && (
              <p id={`${nameFieldId}-error`} className="mt-1.5 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={categoryFieldId}
              className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]"
            >
              Category
            </label>
            <select
              id={categoryFieldId}
              value={category}
              onChange={(event) => setCategory(event.target.value as HabitCategory)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-canvas)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-thread)]"
            >
              {HABIT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
              Icon
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Habit icon">
              {HABIT_ICONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={icon === option}
                  onClick={() => setIcon(option)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition-colors",
                    icon === option
                      ? "border-[var(--color-thread)] bg-[var(--color-thread)]/20"
                      : "border-[var(--color-border)] hover:bg-[var(--color-surface-deep)]"
                  )}
                >
                  <span aria-hidden>{option}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-deep)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-thread)] active:scale-[0.98]"
            >
              Start thread
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
