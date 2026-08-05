"use client";

import { useStore } from "@/lib/store";
import { ProgressBar } from "@/components/ui/progress-bar";
import { levelFromXp, initials, cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export function ProfileChip({ compact = false }: { compact?: boolean }) {
  const profile = useStore((s) => s.profile);
  const { level, progress } = levelFromXp(profile.xp);

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 rounded-field border border-border bg-surface py-1.5 pl-1.5 pr-3">
        <Avatar name={profile.name} url={profile.avatarUrl} color={profile.avatarColor} size={30} />
        <div className="leading-tight">
          <div className="text-xs font-semibold">{profile.name}</div>
          <div className="text-3xs text-muted-2">Lvl {level}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-tile border border-border bg-surface p-3">
      <div className="flex items-center gap-3">
        <Avatar name={profile.name} url={profile.avatarUrl} color={profile.avatarColor} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-semibold">{profile.name}</span>
            <span className="inline-flex items-center gap-1 text-2xs font-semibold text-warning">
              <Flame className="size-3" />
              {profile.streak}
            </span>
          </div>
          <div className="text-2xs text-muted-2">Level {level}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-3xs text-muted-2">
          <span>{profile.xp.toLocaleString("en-IN")} XP</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} color="#10b981" label={`Level ${level} progress`} />
      </div>
    </div>
  );
}

export function Avatar({
  name,
  url,
  color = "#10b981",
  size = 40,
  className,
}: {
  name: string;
  url?: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover shadow-sm", className)}
        style={{
          width: size,
          height: size,
        }}
      />
    );
  }

  return (
    <div
      className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-white", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, ${color}, #14b8a6)`,
        boxShadow: `0 4px 14px -4px ${color}aa`,
      }}
    >
      {initials(name)}
    </div>
  );
}
