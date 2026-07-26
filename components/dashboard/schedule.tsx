"use client";

import { Users, CalendarClock, Target, Coffee, type LucideIcon } from "lucide-react";
import { useStore } from "@/lib/store";
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
    <div className="glass flex h-full flex-col rounded-3xl p-6">
      <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
        <CalendarClock className="size-4 text-secondary" /> Today&apos;s Schedule
      </h3>
      <div className="relative mt-4 flex-1 space-y-1">
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-border" />
        {sorted.map((m) => {
          const k = KIND[m.kind];
          return (
            <div key={m.id} className="relative flex items-start gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-white/[0.03]">
              <div
                className="z-10 mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl"
                style={{ background: `${k.color}1f`, color: k.color, boxShadow: `inset 0 0 0 1px ${k.color}33` }}
              >
                <k.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{m.title}</div>
                <div className="text-[11px] text-muted-2">
                  {m.time}
                  {m.with ? ` · ${m.with}` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
