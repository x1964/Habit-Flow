import type { Habit } from "@/types/habit";
import HabitItem from "@/components/habit/habit-item";

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  return (
    <section aria-labelledby="today-habits-heading">
      <div className="mb-4">
        <h2
          id="today-habits-heading"
          className="font-display text-xl text-[var(--color-ink)]"
        >
          Your threads
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Pick one up and keep it going.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
