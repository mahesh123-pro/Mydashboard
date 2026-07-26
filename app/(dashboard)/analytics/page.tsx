"use client";

import { LineChart, Gauge, Clock, Flame, CheckCircle2, TrendingUp } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { dayKey } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaTrend, BarTrend, RadialGauge } from "@/components/charts/charts";

export default function AnalyticsPage() {
  const hydrated = useHydrated();
  const s = useStore();

  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const ids = s.habits.map((h) => h.id);
  const trend = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i));
    const key = dayKey(d);
    const c = ids.filter((id) => s.habitLog[id]?.[key]).length;
    return { date: d.toLocaleDateString("en-US", { day: "numeric", month: "short" }), value: Math.round((c / ids.length) * 100) };
  });

  let done30 = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    done30 += ids.filter((id) => s.habitLog[id]?.[dayKey(d)]).length;
  }
  const habitRate = Math.round((done30 / (30 * ids.length)) * 100);
  const tasksDone = s.tasks.filter((t) => t.done).length;
  const savingsRate = Math.round(((s.finance.monthlyIncome - s.finance.monthlyExpenses) / s.finance.monthlyIncome) * 100);
  const lifeScore = Math.round(habitRate * 0.4 + (tasksDone / s.tasks.length) * 100 * 0.25 + savingsRate * 0.15 + Math.min(100, s.profile.streak * 3) * 0.2);

  const hours = [
    { label: "Coding", value: 28 },
    { label: "Learning", value: 12 },
    { label: "Gym", value: 6 },
    { label: "Reading", value: 5 },
    { label: "Admin", value: 8 },
  ];

  const recs = [
    "Your habit consistency is strongest in the mornings — protect that window for deep work.",
    "Coding dominates your week (28h). Add 2h of system-design revision for interview readiness.",
    `Savings rate is ${savingsRate}%. Automate a transfer on payday to hit the MacBook goal faster.`,
    "You skip journaling on weekends — a 2-minute Sunday review would close the loop.",
  ];

  return (
    <div className="space-y-5">
      <PageHeader icon={LineChart} title="Analytics" subtitle="The story your data tells." accent="#14b8a6" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Gauge} label="Life score" value={lifeScore} suffix="/100" delta={4} accent="#10b981" />
        <StatCard icon={Clock} label="Focus hours / wk" value={59} accent="#059669" />
        <StatCard icon={Flame} label="Habit rate (30d)" value={habitRate} suffix="%" accent="#f59e0b" />
        <StatCard icon={CheckCircle2} label="Tasks completed" value={tasksDone} accent="#22c55e" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-muted">Habit Completion · 21 days</h3>
          <AreaTrend data={trend} from="#059669" to="#14b8a6" suffix="%" height={230} />
        </GlassCard>
        <GlassCard className="flex flex-col p-6">
          <h3 className="text-sm font-semibold text-muted">Overall Life Score</h3>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full">
              <RadialGauge value={lifeScore} color="#10b981" height={190} label="this month" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-muted">Time Allocation · this week (hrs)</h3>
          <BarTrend data={hours} color="#14b8a6" suffix="h" height={220} />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <TrendingUp className="size-4 text-success" /> Recommendations
          </h3>
          <div className="space-y-2.5">
            {recs.map((r, i) => (
              <div key={i} className="flex gap-2.5 rounded-xl border border-border bg-white/[0.02] p-3 text-xs leading-relaxed text-muted">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-primary/15 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                {r}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
