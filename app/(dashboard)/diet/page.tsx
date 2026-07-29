"use client";

import { Salad, Flame, Egg, Wheat, Droplet, Plus, Minus, Pill } from "lucide-react";
import { toast } from "sonner";
import { usePageReady } from "@/lib/hooks";
import { useStore, todayHealth } from "@/lib/store";
import { clamp, cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Donut, BarTrend } from "@/components/charts/charts";
import { MealPlanner } from "@/components/diet/meal-planner";
import { dayKey } from "@/lib/utils";

const GOALS = { calories: 2600, protein: 160, carbs: 300, fat: 80, water: 8 };

export default function DietPage() {
  const ready = usePageReady();
  const s = useStore();
  const meals = useStore((x) => x.meals);
  const addWater = useStore((x) => x.addWater);
  const supplements = useStore((x) => x.supplements);
  const toggleSupplement = useStore((x) => x.toggleSupplement);

  if (!ready) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const all = Object.values(meals).flat();
  const kcal = all.reduce((a, m) => a + m.kcal, 0);
  const protein = all.reduce((a, m) => a + m.protein, 0);
  const carbs = all.reduce((a, m) => a + m.carbs, 0);
  const fat = all.reduce((a, m) => a + m.fat, 0);
  const water = todayHealth(s).water;

  const macros = [
    { icon: Flame, label: "Calories", value: kcal, goal: GOALS.calories, unit: "kcal", color: "#f59e0b" },
    { icon: Egg, label: "Protein", value: protein, goal: GOALS.protein, unit: "g", color: "#22c55e" },
    { icon: Wheat, label: "Carbs", value: carbs, goal: GOALS.carbs, unit: "g", color: "#14b8a6" },
    { icon: Droplet, label: "Fats", value: fat, goal: GOALS.fat, unit: "g", color: "#059669" },
  ];

  const distribution = [
    { name: "Protein", value: protein * 4, color: "#22c55e" },
    { name: "Carbs", value: carbs * 4, color: "#14b8a6" },
    { name: "Fats", value: fat * 9, color: "#059669" },
  ];

  const weekly = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      value: s.healthLog[dayKey(d)]?.calories ?? 0,
    };
  });

  return (
    <div className="space-y-5">
      <PageHeader icon={Salad} title="Diet & Nutrition" subtitle="Fuel the machine." accent="#22c55e" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {macros.map((m) => {
          const pct = Math.round(clamp(m.value / m.goal) * 100);
          return (
            <GlassCard key={m.label} hover className="flex items-center gap-4 p-5">
              <ProgressRing value={pct} size={72} stroke={8} from={m.color} to={`${m.color}88`}>
                <span className="text-xs font-semibold tabular">{pct}%</span>
              </ProgressRing>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <m.icon className="size-3.5" style={{ color: m.color }} /> {m.label}
                </div>
                <div className="mt-0.5 text-xl font-semibold tabular">{m.value.toLocaleString("en-IN")}</div>
                <div className="text-[11px] text-muted-2">
                  of {m.goal} {m.unit}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6">
          <h3 className="mb-2 text-sm font-semibold text-muted">Macro Distribution</h3>
          <div className="relative">
            <Donut data={distribution} height={210} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular">{kcal}</span>
              <span className="text-[11px] text-muted-2">kcal today</span>
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-4">
            {distribution.map((d) => (
              <span key={d.name} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                <span className="size-2 rounded-full" style={{ background: d.color }} /> {d.name}
              </span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-muted">Weekly Calorie Intake</h3>
          <BarTrend data={weekly} color="#22c55e" suffix=" kcal" height={220} />
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Water */}
        <GlassCard className="flex flex-col p-6">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <Droplet className="size-4 text-accent" /> Water Intake
          </h3>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center">
            <ProgressRing value={Math.round(clamp(water / GOALS.water) * 100)} size={120} stroke={11} from="#14b8a6" to="#10b981">
              <div className="text-2xl font-bold tabular">{water}</div>
              <div className="text-[11px] text-muted-2">of {GOALS.water}</div>
            </ProgressRing>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => addWater(-1)} className="grid size-9 place-items-center rounded-xl border border-border-strong text-muted cursor-pointer hover:text-foreground">
                <Minus className="size-4" />
              </button>
              <button
                onClick={() => {
                  addWater(1);
                  toast("💧 +1 glass");
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent/20 px-4 text-sm font-medium text-accent cursor-pointer"
              >
                <Plus className="size-4" /> Glass
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Supplements */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <Pill className="size-4 text-secondary" /> Supplements
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {supplements.map((sup) => (
              <button
                key={sup.id}
                onClick={() => toggleSupplement(sup.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors",
                  sup.taken ? "border-success/40 bg-success/10" : "border-border bg-white/[0.02] hover:border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-md border",
                    sup.taken ? "border-success bg-success text-white" : "border-border-strong",
                  )}
                >
                  {sup.taken && <span className="size-2 rounded-sm bg-white" />}
                </span>
                <div className="flex-1">
                  <div className={cn("text-sm font-medium", sup.taken && "text-muted line-through")}>{sup.name}</div>
                  <div className="text-[11px] text-muted-2">{sup.dose}</div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      <div>
        <h3 className="mb-3 px-1 text-sm font-semibold text-muted">Meal Planner</h3>
        <MealPlanner />
      </div>
    </div>
  );
}
