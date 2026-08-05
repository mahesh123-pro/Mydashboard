"use client";

import { usePageReady } from "@/lib/hooks";
import { Stagger, Reveal } from "@/components/ui/reveal";
import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Greeting } from "@/components/dashboard/greeting";
import { HealthStats } from "@/components/dashboard/health-stats";
import { TodayProgress } from "@/components/dashboard/today-progress";
import { TasksToday } from "@/components/dashboard/tasks-today";
import { Schedule } from "@/components/dashboard/schedule";
import { Deadlines } from "@/components/dashboard/deadlines";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickNotes } from "@/components/dashboard/quick-notes";
import { AIInsights } from "@/components/dashboard/ai-insights";

export default function DashboardPage() {
  const ready = usePageReady();
  if (!ready) return <DashboardSkeleton />;

  return (
    <Stagger className="space-y-4">
      <Reveal>
        <Greeting />
      </Reveal>

      <Reveal>
        <HealthStats />
      </Reveal>

      <Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <TodayProgress />
            <div className="grid gap-4 sm:grid-cols-2">
              <TasksToday />
              <Schedule />
            </div>
            <AIInsights />
          </div>
          <div className="space-y-4">
            <Deadlines />
            <ActivityFeed />
            <QuickNotes />
          </div>
        </div>
      </Reveal>
    </Stagger>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-56 rounded-panel" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-panel" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-52 rounded-panel" />
          <div className="grid gap-4 sm:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
