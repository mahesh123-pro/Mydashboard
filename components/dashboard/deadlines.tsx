"use client";

import Link from "next/link";
import { CalendarCheck, CalendarClock, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { SectionCard } from "@/components/ui/section-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/empty-state";

export function Deadlines() {
  const projects = useStore((s) => s.projects);
  const now = new Date();

  const upcoming = projects
    .filter((p) => p.status !== "shipped")
    .map((p) => ({ ...p, days: Math.ceil((new Date(p.deadline).getTime() - now.getTime()) / 86400000) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  return (
    <SectionCard
      fill
      icon={CalendarClock}
      iconColor="var(--color-danger)"
      title="Upcoming Deadlines"
      description="Soonest first, across active projects"
      action={
        <Link
          href="/projects"
          className="text-2xs text-muted-2 transition-colors hover:text-foreground"
        >
          All projects
        </Link>
      }
      bodyClassName="space-y-2"
    >
      <>
        {/* Every other widget had an empty state; this one rendered a blank
            card once all projects were shipped. */}
        {upcoming.length === 0 && (
          <EmptyState
            icon={CalendarCheck}
            title="Nothing due"
            description="No active project has an upcoming deadline."
            compact
          />
        )}
        {upcoming.map((p) => {
          const urgent = p.days <= 7;
          return (
            <Link
              key={p.id}
              href="/projects"
              className="group flex items-center gap-3 rounded-field border border-border bg-surface p-3 transition-colors hover:border-border-strong"
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: p.color }} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <ProgressBar
                  value={p.progress}
                  color={p.color}
                  size="xs"
                  gradient={false}
                  label={`${p.name} progress`}
                  className="mt-1.5"
                />
              </div>
              <div className="text-right">
                <div className={`tabular text-sm font-semibold ${urgent ? "text-danger" : "text-foreground"}`}>
                  {p.days <= 0 ? "Due" : `${p.days}d`}
                </div>
                <div className="text-3xs text-muted-2">left</div>
              </div>
              <ChevronRight className="size-4 text-muted-2 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </>
    </SectionCard>
  );
}
