"use client";

import Link from "next/link";
import { CalendarClock, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";

export function Deadlines() {
  const projects = useStore((s) => s.projects);
  const now = new Date();

  const upcoming = projects
    .filter((p) => p.status !== "shipped")
    .map((p) => ({ ...p, days: Math.ceil((new Date(p.deadline).getTime() - now.getTime()) / 86400000) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
          <CalendarClock className="size-4 text-danger" /> Upcoming Deadlines
        </h3>
        <Link href="/projects" className="text-[11px] text-muted-2 transition-colors hover:text-foreground">
          All projects
        </Link>
      </div>
      <div className="mt-4 flex-1 space-y-2.5">
        {upcoming.map((p) => {
          const urgent = p.days <= 7;
          return (
            <Link
              key={p.id}
              href="/projects"
              className="group flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-3 transition-colors hover:border-border-strong"
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
                </div>
              </div>
              <div className="text-right">
                <div className={`tabular text-sm font-semibold ${urgent ? "text-danger" : "text-foreground"}`}>
                  {p.days <= 0 ? "Due" : `${p.days}d`}
                </div>
                <div className="text-[10px] text-muted-2">left</div>
              </div>
              <ChevronRight className="size-4 text-muted-2 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
