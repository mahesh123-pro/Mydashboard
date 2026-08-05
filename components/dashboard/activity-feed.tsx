"use client";

import { Activity, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { getIcon } from "@/lib/icon-map";
import { useNow } from "@/lib/hooks";
import { relativeTime } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";

export function ActivityFeed() {
  const activity = useStore((s) => s.activity);
  const now = useNow(30000);

  return (
    <SectionCard
      fill
      scroll
      icon={Activity}
      iconColor="var(--color-accent)"
      title="Recent Activity"
      description="Your last few completed actions"
      bodyClassName="space-y-1"
    >
      <>
        {activity.length === 0 && (
          <EmptyState icon={Sparkles} title="Nothing yet today" description="Complete a task or habit to see it here." compact />
        )}
        {activity.slice(0, 6).map((a) => {
          const Icon = getIcon(a.icon);
          return (
            <div key={a.id} className="flex items-center gap-3 rounded-field px-1 py-2">
              <div
                className="grid size-8 shrink-0 place-items-center rounded-control"
                style={{ background: `${a.color}1f`, color: a.color }}
              >
                <Icon className="size-4" />
              </div>
              <span className="min-w-0 flex-1 truncate text-sm text-muted">{a.text}</span>
              <span className="shrink-0 text-2xs text-muted-2">
                {a.ts ? relativeTime(a.ts, now?.getTime()) : a.time}
              </span>
            </div>
          );
        })}
      </>
    </SectionCard>
  );
}
