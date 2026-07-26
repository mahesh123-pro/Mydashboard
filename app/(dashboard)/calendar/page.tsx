"use client";

import { CalendarDays, Users, CalendarClock, Cake, Target } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const WD = ["S", "M", "T", "W", "T", "F", "S"];

export default function CalendarPage() {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const clampDay = (d: number) => Math.min(daysInMonth, Math.max(1, d));
  const events: Record<number, { title: string; color: string; icon: typeof Users }[]> = {
    [today]: [{ title: "VisaEnsure deadline", color: "#ef4444", icon: CalendarClock }],
    [clampDay(today + 2)]: [{ title: "Client call — Bloom", color: "#059669", icon: Users }],
    [clampDay(today + 5)]: [{ title: "AWS exam", color: "#f59e0b", icon: Target }],
    [clampDay(today - 3)]: [{ title: "Team standup", color: "#10b981", icon: Users }],
    [clampDay(today + 9)]: [{ title: "Mentor's birthday", color: "#22c55e", icon: Cake }],
  };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const upcoming = Object.entries(events)
    .map(([d, evs]) => ({ day: Number(d), evs }))
    .filter((e) => e.day >= today)
    .sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-5">
      <PageHeader icon={CalendarDays} title="Calendar" subtitle={monthName} accent="#10b981" />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="mb-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-2">
            {WD.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const isToday = d === today;
              const evs = events[d];
              return (
                <div
                  key={i}
                  className={cn(
                    "relative flex aspect-square flex-col rounded-xl border p-1.5 text-xs transition-colors",
                    isToday ? "border-primary/50 bg-primary/10" : "border-border bg-white/[0.02] hover:border-border-strong",
                  )}
                >
                  <span className={cn("tabular self-end font-medium", isToday && "text-primary")}>{d}</span>
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {evs?.slice(0, 3).map((e, j) => (
                      <span key={j} className="size-1.5 rounded-full" style={{ background: e.color }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.flatMap((u) =>
              u.evs.map((e, j) => (
                <div key={u.day + "-" + j} className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${e.color}1f`, color: e.color }}>
                    <e.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{e.title}</div>
                    <div className="text-[11px] text-muted-2">
                      {new Date(year, month, u.day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              )),
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
