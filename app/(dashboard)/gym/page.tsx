"use client";

import { toast } from "sonner";
import { Dumbbell, Scale, Percent, Activity, Flame, Trophy, Plus } from "lucide-react";
import { usePageReady } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { bodyHeightCm } from "@/lib/data/seed";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AreaTrend, BarTrend } from "@/components/charts/charts";
import { WorkoutTimer } from "@/components/gym/workout-timer";

const TYPE_COLOR: Record<string, string> = {
  Push: "#10b981",
  Pull: "#14b8a6",
  Legs: "#f59e0b",
  Cardio: "#22c55e",
};

export default function GymPage() {
  const ready = usePageReady();
  const body = useStore((s) => s.body);
  const workouts = useStore((s) => s.workouts);
  const prs = useStore((s) => s.prs);
  const addWorkout = useStore((s) => s.addWorkout);

  if (!ready) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const latest = body[body.length - 1];
  const prev = body[body.length - 2] ?? latest;
  const bmi = +(latest.weight / Math.pow(bodyHeightCm / 100, 2)).toFixed(1);
  const weightDelta = +(((latest.weight - prev.weight) / prev.weight) * 100).toFixed(1);

  const weightData = body.map((b) => ({
    date: new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: b.weight,
  }));
  const sessions = [...workouts]
    .reverse()
    .map((w) => ({
      label: new Date(w.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      value: w.caloriesBurned,
    }));

  const logSample = () => {
    const today = new Date().toISOString().slice(0, 10);
    addWorkout({
      date: today,
      type: "Push",
      title: "Push Day",
      durationMin: 62,
      caloriesBurned: 540,
      exercises: [
        { name: "Bench Press", sets: [{ weight: 82, reps: 6 }, { weight: 82, reps: 6 }, { weight: 80, reps: 7 }] },
        { name: "Overhead Press", sets: [{ weight: 52, reps: 8 }, { weight: 52, reps: 7 }] },
      ],
    });
    toast.success("Workout logged", { description: "Push Day · 540 kcal" });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Dumbbell}
        title="Gym"
        subtitle="Train hard. Track everything."
        accent="#ef4444"
        actions={
          <Button size="sm" onClick={logSample}>
            <Plus className="size-4" /> Log workout
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Scale} label="Body weight" value={latest.weight} decimals={1} suffix=" kg" delta={weightDelta} accent="#10b981" />
        <StatCard icon={Percent} label="Body fat" value={latest.bodyFat} decimals={1} suffix="%" accent="#059669" />
        <StatCard icon={Activity} label="BMI" value={bmi} decimals={1} sub="Healthy range" accent="#14b8a6" />
        <StatCard icon={Flame} label="Workouts logged" value={workouts.length} accent="#ef4444" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted">Body Weight Trend</h3>
            <Badge color="#22c55e">-2.8 kg / 8 wk</Badge>
          </div>
          <AreaTrend data={weightData} from="#10b981" to="#14b8a6" suffix=" kg" height={230} />
        </GlassCard>
        <WorkoutTimer />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-muted">Calories Burned / Session</h3>
          <BarTrend data={sessions} color="#ef4444" suffix=" kcal" height={220} />
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <Trophy className="size-4 text-warning" /> Personal Records
          </h3>
          <div className="space-y-2">
            {prs.map((pr) => (
              <div key={pr.exercise} className="flex items-center justify-between rounded-xl border border-border bg-white/[0.02] px-3 py-2.5">
                <span className="text-sm">{pr.exercise}</span>
                <span className="tabular text-sm font-semibold text-warning">{pr.weight} kg</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-muted">Workout Log</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {workouts.slice(0, 6).map((w) => (
            <div key={w.id} className="rounded-2xl border border-border bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge color={TYPE_COLOR[w.type]}>{w.type}</Badge>
                  <span className="text-sm font-medium">{w.title}</span>
                </div>
                <span className="text-[11px] text-muted-2">
                  {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {w.exercises.map((ex) => (
                  <span key={ex.name} className="rounded-lg bg-white/[0.04] px-2 py-1 text-[11px] text-muted">
                    {ex.name} · {ex.sets.length}×{ex.sets[0]?.reps ?? "-"}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-2">
                <span className="inline-flex items-center gap-1">
                  <Activity className="size-3" /> {w.durationMin} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3" /> {w.caloriesBurned} kcal
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
