interface EmptyStateProps {
  onAddHabit: () => void;
}

export default function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="shadow-card flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20 text-center">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true" className="mb-6">
        <circle cx="36" cy="36" r="31" fill="none" stroke="var(--color-thread-gold-deep)" strokeWidth="3.5" />
        <rect x="50" y="2" width="6" height="11" rx="1.5" fill="var(--color-thread-gold-deep)" />
        <circle cx="36" cy="36" r="24" fill="var(--color-canvas)" stroke="var(--color-border)" strokeWidth="1.5" />
        <path
          d="M28 32 L44 48 M44 32 L28 48"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2.5 4"
        />
      </svg>
      <h2 className="font-display text-2xl italic text-[var(--color-ink)]">No threads yet</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--color-ink-soft)]">
        Every habit starts as a single stitch.
        <br />
        Start your first one.
      </p>
      <button
        type="button"
        onClick={onAddHabit}
        className="shadow-card mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-surface)] transition-all hover:bg-[var(--color-thread-deep)] hover:shadow-card-hover active:scale-[0.98]"
      >
        <span className="text-base leading-none">+</span>
        Start your first thread
      </button>
    </div>
  );
}
