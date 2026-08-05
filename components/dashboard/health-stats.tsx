"use client";

import { Droplets, Flame, Egg, Dumbbell, Plus, Minus, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GlassCard } from "@/components/ui/glass-card";
import { clamp, dayKey } from "@/lib/utils";

export function HealthStats() {
  // Slice selectors instead of `useStore()` — see TodayProgress for why.
  const healthLog = useStore((s) => s.healthLog);
  const g = useStore((s) => s.healthGoals);
  const addWater = useStore((s) => s.addWater);

  const h = healthLog[dayKey()] ?? { water: 0, calories: 0, protein: 0, caloriesBurned: 0 };

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {/* Water — interactive */}
      <GlassCard hover className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Water</span>
          <Droplets className="size-4 text-accent" aria-hidden />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold tabular">
              {h.water}
              <span className="text-sm text-muted-2">/{g.water}</span>
            </div>
            <div className="text-2xs text-muted-2">glasses</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                addWater(1);
                toast("💧 +1 glass");
              }}
              aria-label="Add a glass of water"
              className="grid size-7 cursor-pointer place-items-center rounded-control bg-accent/15 text-accent transition-colors hover:bg-accent/25"
            >
              <Plus className="size-3.5" aria-hidden />
            </button>
            <button
              onClick={() => addWater(-1)}
              aria-label="Remove a glass of water"
              disabled={h.water === 0}
              className="grid size-7 cursor-pointer place-items-center rounded-control bg-surface-hover text-muted-2 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
        <div
          className="mt-4 flex gap-1"
          role="img"
          aria-label={`${h.water} of ${g.water} glasses`}
        >
          {Array.from({ length: g.water }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i < h.water ? "#14b8a6" : "var(--track)" }}
            />
          ))}
        </div>
      </GlassCard>

      <RingStat icon={Flame} label="Calories" value={h.calories} goal={g.calories} unit="kcal" from="#f59e0b" to="#ef4444" />
      <RingStat icon={Egg} label="Protein" value={h.protein} goal={g.protein} unit="g" from="#22c55e" to="#14b8a6" />
      <RingStat icon={Dumbbell} label="Burned" value={h.caloriesBurned} goal={g.burn} unit="kcal" from="#059669" to="#10b981" />
    </div>
  );
}

function RingStat({
  icon: Icon,
  label,
  value,
  goal,
  unit,
  from,
  to,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  goal: number;
  unit: string;
  from: string;
  to: string;
}) {
  const pct = Math.round(clamp(value / goal) * 100);
  return (
    <GlassCard hover className="p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <Icon className="size-4" style={{ color: from }} aria-hidden />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProgressRing value={pct} size={62} stroke={7} from={from} to={to}>
          <span className="text-xs font-semibold tabular">{pct}%</span>
        </ProgressRing>
        <div className="min-w-0">
          <div className="text-xl font-semibold tabular">{value.toLocaleString("en-IN")}</div>
          <div className="text-2xs text-muted-2">
            of {goal.toLocaleString("en-IN")} {unit}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
