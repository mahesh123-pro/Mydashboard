"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Check, Users, CalendarClock, Target, Coffee } from "lucide-react";
import { usePageReady } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Ev = {
  id: string;
  time: string;
  title: string;
  kind: "task" | "meeting" | "deadline" | "focus" | "personal";
  done?: boolean;
  priority?: "low" | "medium" | "high" | "urgent";
};

const KIND_META: Record<string, { color: string; icon: typeof Users }> = {
  task: { color: "#10b981", icon: Check },
  meeting: { color: "#059669", icon: Users },
  deadline: { color: "#ef4444", icon: CalendarClock },
  focus: { color: "#22c55e", icon: Target },
  personal: { color: "#f59e0b", icon: Coffee },
};

export default function LifePage() {
  const ready = usePageReady();
  const tasks = useStore((s) => s.tasks);
  const meetings = useStore((s) => s.meetings);
  const toggleTask = useStore((s) => s.toggleTask);
  const [view, setView] = useState<"timeline" | "kanban">("timeline");

  if (!ready) return <Skeleton className="h-[60vh] rounded-panel" />;

  const events: Ev[] = [
    ...tasks.filter((t) => t.time).map((t) => ({ id: t.id, time: t.time!, title: t.title, kind: "task" as const, done: t.done, priority: t.priority })),
    ...meetings.map((m) => ({ id: m.id, time: m.time, title: m.title, kind: m.kind })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  const cols = [
    { label: "Morning", range: [0, 12] },
    { label: "Afternoon", range: [12, 17] },
    { label: "Evening", range: [17, 24] },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HeartPulse}
        title="My Life"
        subtitle="Your day, orchestrated."
        accent="#ec4899"
        actions={
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { label: "Timeline", value: "timeline" },
              { label: "Kanban", value: "kanban" },
            ]}
          />
        }
      />

      {view === "timeline" ? (
        <GlassCard className="p-6">
          <div className="relative space-y-1 pl-2">
            <div className="absolute bottom-3 left-[27px] top-3 w-px bg-border" />
            {events.map((e, i) => {
              const meta = KIND_META[e.kind];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={e.id + i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative flex items-center gap-4 rounded-field px-2 py-2.5 transition-colors hover:bg-surface"
                >
                  <span className="tabular w-12 shrink-0 text-right text-2xs text-muted-2">{e.time}</span>
                  <span className="z-10 grid size-9 shrink-0 place-items-center rounded-field" style={{ background: `${meta.color}1f`, color: meta.color, boxShadow: `inset 0 0 0 1px ${meta.color}33` }}>
                    <Icon className="size-4" />
                  </span>
                  <button
                    onClick={() => e.kind === "task" && toggleTask(e.id)}
                    className={cn("min-w-0 flex-1 text-left text-sm", e.done && "text-muted-2 line-through", e.kind === "task" && "cursor-pointer")}
                  >
                    {e.title}
                  </button>
                  {e.priority && !e.done && <PriorityBadge priority={e.priority} />}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {cols.map((col) => {
            const items = events.filter((e) => {
              const h = parseInt(e.time.split(":")[0], 10);
              return h >= col.range[0] && h < col.range[1];
            });
            return (
              <GlassCard key={col.label} className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{col.label}</h3>
                  <span className="text-2xs text-muted-2">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((e) => {
                    const meta = KIND_META[e.kind];
                    return (
                      <div key={e.id} className="rounded-field border border-border bg-surface p-3">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full" style={{ background: meta.color }} />
                          <span className="tabular text-2xs text-muted-2">{e.time}</span>
                        </div>
                        <div className={cn("mt-1 text-sm", e.done && "text-muted-2 line-through")}>{e.title}</div>
                      </div>
                    );
                  })}
                  {items.length === 0 && <div className="rounded-field border border-dashed border-border py-6 text-center text-xs text-muted-2">Nothing scheduled</div>}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
