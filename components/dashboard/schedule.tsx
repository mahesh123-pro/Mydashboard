"use client";

import { Users, CalendarClock, Target, Coffee, type LucideIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { SectionCard } from "@/components/ui/section-card";
import type { Meeting } from "@/lib/types";

const KIND: Record<Meeting["kind"], { icon: LucideIcon; color: string }> = {
  meeting: { icon: Users, color: "#10b981" },
  deadline: { icon: CalendarClock, color: "#ef4444" },
  focus: { icon: Target, color: "#22c55e" },
  personal: { icon: Coffee, color: "#f59e0b" },
};

export function Schedule() {
  const meetings = useStore((s) => s.meetings);
  const sorted = [...meetings].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <SectionCard
      fill
      icon={CalendarClock}
      iconColor="var(--color-secondary)"
      title="Today's Schedule"
      description={sorted.length ? `${sorted.length} entries` : undefined}
      bodyClassName="relative space-y-1"
    >
      <>
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-border" aria-hidden />
        {sorted.map((m) => {
          const k = KIND[m.kind];
          return (
            <div key={m.id} className="relative flex items-start gap-3 rounded-field px-1 py-2 transition-colors hover:bg-surface">
              <div
                className="z-10 mt-0.5 grid size-9 shrink-0 place-items-center rounded-field"
                style={{ background: `${k.color}1f`, color: k.color, boxShadow: `inset 0 0 0 1px ${k.color}33` }}
              >
                <k.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{m.title}</div>
                <div className="text-2xs text-muted-2">
                  {m.time}
                  {m.with ? ` · ${m.with}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </>
    </SectionCard>
  );
}
