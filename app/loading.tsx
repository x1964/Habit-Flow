export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="flex flex-col items-center gap-5" role="status" aria-live="polite">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          aria-hidden="true"
          style={{ animation: "spin-slow 2.2s linear infinite" }}
        >
          {/* outer hoop */}
          <circle
            cx="36"
            cy="36"
            r="31"
            fill="none"
            stroke="var(--color-thread-gold-deep)"
            strokeWidth="3.5"
          />
          <rect x="50" y="2" width="6" height="11" rx="1.5" fill="var(--color-thread-gold-deep)" />
          {/* inner fabric */}
          <circle cx="36" cy="36" r="24" fill="var(--color-canvas)" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* running stitch tracing the inner ring, animated as a drawing thread */}
          <circle
            cx="36"
            cy="36"
            r="18"
            fill="none"
            stroke="var(--color-thread)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 7"
            style={{ animation: "dash-spin 1.4s linear infinite" }}
          />
          {/* needle at center */}
          <circle cx="36" cy="36" r="2.5" fill="var(--color-ink)" />
        </svg>

        <p className="font-mono-label text-[10px] uppercase text-[var(--color-ink-soft)]">
          Threading the needle&hellip;
        </p>
        <span className="sr-only">Loading</span>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dash-spin {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -52; }
        }
        @media (prefers-reduced-motion: reduce) {
          svg, circle {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
