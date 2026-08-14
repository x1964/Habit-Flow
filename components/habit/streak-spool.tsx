import { cn } from "@/lib/utils";

interface StreakSpoolProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = { sm: 30, md: 46, lg: 88 };

/**
 * Renders the streak as a wound bobbin of embroidery floss: coil turns
 * scale with streak length, standing in for the usual "🔥 N days" pattern.
 */
export default function StreakSpool({ streak, size = "sm", className }: StreakSpoolProps) {
  const box = SIZE_MAP[size];
  const center = box / 2;
  const active = streak > 0;
  const turns = Math.min(4.5, Math.max(0.2, streak / 4.5));
  const gradientId = `floss-gradient-${size}-${streak}`;

  const buildCoil = (offsetDeg: number, steps = 72) => {
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * Math.PI * 2;
      const r = box * 0.1 + (t / (turns * Math.PI * 2 || 1)) * (box * 0.34);
      const x = center + r * Math.cos(t - Math.PI / 2 + (offsetDeg * Math.PI) / 180);
      const y = center + r * Math.sin(t - Math.PI / 2 + (offsetDeg * Math.PI) / 180);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      width={box}
      height={box}
      className={cn(!active && "opacity-45", className)}
      role="img"
      aria-label={streak > 0 ? `${streak} day streak, wound as thread` : "No active streak"}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-thread-gold)" />
          <stop offset="100%" stopColor="var(--color-thread-gold-deep)" />
        </linearGradient>
      </defs>

      {active ? (
        <>
          <polyline
            points={buildCoil(-2)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={Math.max(2, box * 0.05)}
            strokeLinecap="round"
            opacity={0.5}
          />
          <polyline
            points={buildCoil(0)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={Math.max(1.6, box * 0.038)}
            strokeLinecap="round"
          />
          <circle cx={center} cy={center} r={box * 0.055} fill="var(--color-ink)" />
        </>
      ) : (
        <>
          <circle
            cx={center}
            cy={center}
            r={box * 0.08}
            fill="none"
            stroke="var(--color-ink-soft)"
            strokeWidth={Math.max(1.2, box * 0.025)}
            strokeDasharray="2.5 3.5"
          />
        </>
      )}
    </svg>
  );
}
