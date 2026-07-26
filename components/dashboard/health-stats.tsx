"use client";

import { Droplets, Flame, Egg, Dumbbell, Plus, Minus, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore, todayHealth } from "@/lib/store";
import { ProgressRing } from "@/components/ui/progress-ring";
import { clamp } from "@/lib/utils";

export function HealthStats() {
  const s = useStore();
  const addWater = useStore((x) => x.addWater);
  const h = todayHealth(s);
  const g = s.healthGoals;

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {/* Water — interactive */}
      <div className="glass card-hover rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Water</span>
          <Droplets className="size-4 text-accent" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-2xl font-semibold tabular">
              {h.water}
              <span className="text-sm text-muted-2">/{g.water}</span>
            </div>
            <div className="text-[11px] text-muted-2">glasses</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                addWater(1);
                toast("💧 +1 glass");
              }}
              className="grid size-7 place-items-center rounded-lg bg-accent/15 text-accent transition-colors hover:bg-accent/25 cursor-pointer"
            >
              <Plus className="size-3.5" />
            </button>
            <button
              onClick={() => addWater(-1)}
              className="grid size-7 place-items-center rounded-lg bg-white/[0.05] text-muted-2 transition-colors hover:text-foreground cursor-pointer"
            >
              <Minus className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: g.water }).map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i < h.water ? "#14b8a6" : "rgba(255,255,255,0.08)" }}
            />
          ))}
        </div>
      </div>

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
    <div className="glass card-hover rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <Icon className="size-4" style={{ color: from }} />
      </div>
      <div className="mt-2 flex items-center gap-3">
        <ProgressRing value={pct} size={64} stroke={7} from={from} to={to}>
          <span className="text-xs font-semibold tabular">{pct}%</span>
        </ProgressRing>
        <div>
          <div className="text-xl font-semibold tabular">{value.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-muted-2">
            of {goal.toLocaleString("en-IN")} {unit}
          </div>
        </div>
      </div>
    </div>
  );
}
