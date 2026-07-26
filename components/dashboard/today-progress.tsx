"use client";

import { useStore, todayHealth, habitCompletion } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { CheckCircle2, ListChecks, Salad } from "lucide-react";
import { clamp } from "@/lib/utils";

export function TodayProgress() {
  const s = useStore();
  const tasksTotal = s.tasks.length;
  const tasksDone = s.tasks.filter((t) => t.done).length;
  const { done: hDone, total: hTotal } = habitCompletion(s);
  const health = todayHealth(s);
  const g = s.healthGoals;

  const tasksPct = tasksTotal ? (tasksDone / tasksTotal) * 100 : 0;
  const habitsPct = hTotal ? (hDone / hTotal) * 100 : 0;
  const healthPct =
    ((clamp(health.water / g.water) + clamp(health.protein / g.protein) + clamp(health.calories / g.calories)) /
      3) *
    100;
  const overall = Math.round((tasksPct + habitsPct + healthPct) / 3);

  const rows = [
    { icon: ListChecks, label: "Tasks", value: `${tasksDone}/${tasksTotal}`, pct: tasksPct, color: "#10b981" },
    { icon: CheckCircle2, label: "Habits", value: `${hDone}/${hTotal}`, pct: habitsPct, color: "#059669" },
    { icon: Salad, label: "Nutrition", value: `${Math.round(healthPct)}%`, pct: healthPct, color: "#14b8a6" },
  ];

  return (
    <div className="glass flex flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted">Today&apos;s Progress</h3>
        <span className="text-[11px] text-muted-2">Daily completion</span>
      </div>
      <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
        <ProgressRing value={overall} size={148} stroke={13}>
          <div className="text-3xl font-bold tabular">{overall}%</div>
          <div className="text-[11px] text-muted-2">complete</div>
        </ProgressRing>
        <div className="w-full flex-1 space-y-3.5">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <r.icon className="size-3.5" style={{ color: r.color }} />
                  {r.label}
                </span>
                <span className="tabular font-medium">{r.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${Math.round(r.pct)}%`, background: `linear-gradient(90deg, ${r.color}, ${r.color}aa)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
