"use client";

import { useStore } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionCard } from "@/components/ui/section-card";
import { LabeledProgress } from "@/components/ui/progress-bar";
import { CheckCircle2, ListChecks, Salad, Gauge } from "lucide-react";
import { clamp, dayKey } from "@/lib/utils";

export function TodayProgress() {
  // Was `useStore()` with no selector, which subscribes to the whole store —
  // every keystroke in Quick Notes re-rendered this card and restarted the ring
  // animation. These slice selectors only fire when their own data changes.
  const tasks = useStore((s) => s.tasks);
  const habits = useStore((s) => s.habits);
  const habitLog = useStore((s) => s.habitLog);
  const healthLog = useStore((s) => s.healthLog);
  const g = useStore((s) => s.healthGoals);

  const today = dayKey();
  const health = healthLog[today] ?? { water: 0, calories: 0, protein: 0, caloriesBurned: 0 };

  const tasksTotal = tasks.length;
  const tasksDone = tasks.filter((t) => t.done).length;
  const hTotal = habits.length;
  const hDone = habits.filter((h) => habitLog[h.id]?.[today]).length;

  const tasksPct = tasksTotal ? (tasksDone / tasksTotal) * 100 : 0;
  const habitsPct = hTotal ? (hDone / hTotal) * 100 : 0;
  const healthPct =
    ((clamp(health.water / g.water) +
      clamp(health.protein / g.protein) +
      clamp(health.calories / g.calories)) /
      3) *
    100;
  const overall = Math.round((tasksPct + habitsPct + healthPct) / 3);

  const rows = [
    { icon: ListChecks, label: "Tasks", caption: `${tasksDone}/${tasksTotal}`, pct: tasksPct, color: "#10b981" },
    { icon: CheckCircle2, label: "Habits", caption: `${hDone}/${hTotal}`, pct: habitsPct, color: "#059669" },
    { icon: Salad, label: "Nutrition", caption: `${Math.round(healthPct)}%`, pct: healthPct, color: "#14b8a6" },
  ];

  return (
    <SectionCard
      icon={Gauge}
      iconColor="#10b981"
      title="Today's Progress"
      description="Tasks, habits and nutrition, averaged across the day"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <ProgressRing value={overall} size={140} stroke={12}>
          <div className="text-3xl font-semibold tabular">{overall}%</div>
          <div className="text-2xs text-muted-2">complete</div>
        </ProgressRing>
        <div className="w-full flex-1 space-y-4">
          {rows.map((r) => (
            <LabeledProgress
              key={r.label}
              icon={r.icon}
              label={r.label}
              value={r.pct}
              caption={r.caption}
              color={r.color}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
