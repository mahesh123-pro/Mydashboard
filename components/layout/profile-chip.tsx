"use client";

import { useStore } from "@/lib/store";
import { levelFromXp, initials, cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export function ProfileChip({ compact = false }: { compact?: boolean }) {
  const profile = useStore((s) => s.profile);
  const { level, progress } = levelFromXp(profile.xp);

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white/[0.03] py-1.5 pl-1.5 pr-3">
        <Avatar name={profile.name} url={profile.avatarUrl} color={profile.avatarColor} size={30} />
        <div className="leading-tight">
          <div className="text-xs font-semibold">{profile.name}</div>
          <div className="text-[10px] text-muted-2">Lvl {level}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        <Avatar name={profile.name} url={profile.avatarUrl} color={profile.avatarColor} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-semibold">{profile.name}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning">
              <Flame className="size-3" />
              {profile.streak}
            </span>
          </div>
          <div className="text-[11px] text-muted-2">Level {level}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] text-muted-2">
          <span>{profile.xp.toLocaleString("en-IN")} XP</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
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
