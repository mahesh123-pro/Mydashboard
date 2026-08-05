"use client";

import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";
import { AnimatedNumber } from "./animated-number";
import { ProgressBar } from "./progress-bar";
import { relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  description,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  delta,
  deltaLabel,
  progress,
  progressLabel,
  updatedAt,
  accent = "#10b981",
  sub,
  className,
  blur = false,
}: {
  icon: LucideIcon;
  /** Card title. */
  label: string;
  /** One line of supporting context under the title. */
  description?: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  /** Percentage change. Positive is styled as up, negative as down, 0 as flat. */
  delta?: number;
  /** What the delta is measured against, e.g. "vs last week". */
  deltaLabel?: string;
  /** 0–100. Renders a progress bar under the value when provided. */
  progress?: number;
  /** Caption shown opposite the progress percentage. */
  progressLabel?: string;
  /** Epoch ms. Renders a "last updated" line at the foot of the card. */
  updatedAt?: number;
  accent?: string;
  sub?: string;
  className?: string;
  /** Obscures the value (e.g. Finance page "blur amounts" privacy toggle). */
  blur?: boolean;
}) {
  const hasDelta = delta !== undefined;
  const flat = hasDelta && Math.abs(delta) < 0.05;
  const up = (delta ?? 0) > 0;
  const TrendIcon = flat ? Minus : up ? TrendingUp : TrendingDown;

  return (
    <GlassCard
      hover
      className={cn("group relative flex flex-col overflow-hidden p-6", className)}
    >
      {/* Accent wash — a hairline at the top edge rather than a blurred blob.
          The blob cost a composited layer per card and read as decoration; the
          rule reads as a category marker. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className="grid size-9 shrink-0 place-items-center rounded-field transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `${accent}1f`,
            color: accent,
            boxShadow: `inset 0 0 0 1px ${accent}33`,
          }}
        >
          <Icon className="size-[18px]" aria-hidden />
        </div>

        {hasDelta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold tabular",
              flat
                ? "bg-surface text-muted-2"
                : up
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger",
            )}
            title={deltaLabel}
          >
            <TrendIcon className="size-3" aria-hidden />
            {flat ? "0" : Math.abs(delta).toFixed(Math.abs(delta) % 1 === 0 ? 0 : 1)}%
          </span>
        )}
      </div>

      <div className="mt-4">
        <div
          className={cn(
            "text-2xl font-semibold tracking-tight tabular transition-[filter]",
            blur && "select-none blur-sm",
          )}
        >
          <AnimatedNumber
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
            format={format}
          />
        </div>
        <div className="mt-1 text-sm font-medium text-muted">{label}</div>
        {description && (
          <p className="mt-0.5 text-2xs leading-relaxed text-muted-2">{description}</p>
        )}
        {sub && <div className="mt-1 text-2xs text-muted-2">{sub}</div>}
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <ProgressBar value={progress} color={accent} size="xs" label={`${label} progress`} />
          <div className="mt-1.5 flex items-center justify-between text-3xs text-muted-2">
            <span>{progressLabel ?? "of goal"}</span>
            <span className="tabular">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {(updatedAt !== undefined || deltaLabel) && (
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-3xs text-muted-2">
          {deltaLabel ? <span className="truncate">{deltaLabel}</span> : <span />}
          {updatedAt !== undefined && (
            <time dateTime={new Date(updatedAt).toISOString()} className="shrink-0">
              Updated {relativeTime(updatedAt)}
            </time>
          )}
        </div>
      )}
    </GlassCard>
  );
}
