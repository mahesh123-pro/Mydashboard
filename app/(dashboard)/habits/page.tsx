"use client";

import { Reorder, useDragControls } from "framer-motion";
import { ListChecks, Flame, CheckCircle2, Trophy, Percent, Check, GripVertical } from "lucide-react";
import { usePageReady } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { dayKey, cn } from "@/lib/utils";
import { getIcon } from "@/lib/icon-map";
import type { Habit } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarTrend } from "@/components/charts/charts";
import { HabitHeatmap } from "@/components/habits/habit-heatmap";

function streakOf(log: Record<string, boolean> | undefined, days = 400) {
  let s = 0;
  const t = new Date();
  for (let d = 0; d < days; d++) {
    const day = new Date(t);
    day.setDate(day.getDate() - d);
    if (log?.[dayKey(day)]) s++;
    else if (d === 0) continue;
    else break;
  }
  return s;
}

export default function HabitsPage() {
  const ready = usePageReady();
  const habits = useStore((s) => s.habits);
  const habitLog = useStore((s) => s.habitLog);
  const toggleHabit = useStore((s) => s.toggleHabit);
  const reorderHabits = useStore((s) => s.reorderHabits);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-64 rounded-tile" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-panel" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-panel" />
      </div>
    );
  }

  const today = dayKey();
  const ids = habits.map((h) => h.id);
  const doneToday = habits.filter((h) => habitLog[h.id]?.[today]).length;
  const overallStreak = (() => {
    let s = 0;
    const t = new Date();
    for (let d = 0; d < 400; d++) {
      const day = new Date(t);
      day.setDate(day.getDate() - d);
      const key = dayKey(day);
      const c = ids.filter((id) => habitLog[id]?.[key]).length;
      if (c >= 4) s++;
      else if (d === 0) continue;
      else break;
    }
    return s;
  })();
  const best = Math.max(...habits.map((h) => streakOf(habitLog[h.id])), 0);

  // 30-day completion rate
  let done30 = 0;
  for (let d = 0; d < 30; d++) {
    const day = new Date();
    day.setDate(day.getDate() - d);
    const key = dayKey(day);
    done30 += ids.filter((id) => habitLog[id]?.[key]).length;
  }
  const rate30 = Math.round((done30 / (30 * habits.length)) * 100);

  // weekly bar
  const weekly = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    const key = dayKey(day);
    return {
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      value: ids.filter((id) => habitLog[id]?.[key]).length,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="Habit Tracker"
        subtitle="Small daily wins, compounded."
        accent="#059669"
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Flame} label="Current streak" value={overallStreak} suffix=" days" accent="#f59e0b" />
        <StatCard icon={CheckCircle2} label="Done today" value={doneToday} suffix={`/${habits.length}`} accent="#22c55e" />
        <StatCard icon={Trophy} label="Best habit streak" value={best} suffix=" days" accent="#059669" />
        <StatCard icon={Percent} label="30-day rate" value={rate30} suffix="%" accent="#14b8a6" />
      </div>

      <GlassCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted">Today&apos;s Habits</h3>
          <span className="text-2xs text-muted-2">Drag the handle to reorder</span>
        </div>
        <Reorder.Group
          as="div"
          axis="y"
          values={habits}
          onReorder={(v) => reorderHabits(v.map((h) => h.id))}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {habits.map((h) => (
            <HabitTile key={h.id} habit={h} done={habitLog[h.id]?.[today] ?? false} streak={streakOf(habitLog[h.id])} onToggle={() => toggleHabit(h.id)} />
          ))}
        </Reorder.Group>
      </GlassCard>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-5">
        <GlassCard className="p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted">Consistency</h3>
            <span className="text-2xs text-muted-2">Habit completion heatmap</span>
          </div>
          <HabitHeatmap habitLog={habitLog} habitIds={ids} weeks={18} />
        </GlassCard>
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-muted">This Week</h3>
          <BarTrend data={weekly} color="#059669" height={200} />
        </GlassCard>
      </div>
    </div>
  );
}

function HabitTile({
  habit: h,
  done,
  streak,
  onToggle,
}: {
  habit: Habit;
  done: boolean;
  streak: number;
  onToggle: () => void;
}) {
  const controls = useDragControls();
  const Icon = getIcon(h.icon);
  return (
    <Reorder.Item
      as="div"
      value={h}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "group flex items-center gap-3 rounded-tile border p-3.5 transition-colors",
        done ? "border-transparent" : "border-border bg-surface hover:border-border-strong",
      )}
      style={done ? { background: `${h.color}1f`, boxShadow: `inset 0 0 0 1px ${h.color}44` } : undefined}
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-muted-2 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <button onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer">
        <div className="grid size-10 shrink-0 place-items-center rounded-field" style={{ background: `${h.color}22`, color: h.color }}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{h.name}</div>
          <div className="flex items-center gap-1 text-2xs text-muted-2">
            <Flame className="size-3 text-warning" /> {streak} day streak
          </div>
        </div>
        <span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
            done ? "border-transparent text-white" : "border-border-strong text-transparent",
          )}
          style={done ? { background: h.color } : undefined}
        >
          <Check className="size-4" strokeWidth={3} />
        </span>
      </button>
    </Reorder.Item>
  );
}
