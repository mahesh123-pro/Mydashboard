"use client";

import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md";

const HEIGHT: Record<Size, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
};

/**
 * The one progress bar.
 *
 * This markup was previously inlined in 11 places, each with a slightly
 * different height, track colour and gradient — and every one of those tracks
 * used `bg-white/[0.06]`, which is invisible in light mode. Centralising it
 * fixes the theme bug once and makes the fill language consistent.
 */
export function ProgressBar({
  value,
  color = "#10b981",
  size = "sm",
  gradient = true,
  label,
  className,
}: {
  /** 0–100. Values outside the range are clamped. */
  value: number;
  color?: string;
  size?: Size;
  /** Fade the fill toward transparent at its leading edge. */
  gradient?: boolean;
  /** Accessible name. Falls back to a generic "Progress" label. */
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn("w-full overflow-hidden rounded-full bg-track", HEIGHT[size], className)}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `${pct}%`,
          background: gradient ? `linear-gradient(90deg, ${color}, ${color}99)` : color,
        }}
      />
    </div>
  );
}

/**
 * Progress bar with a caption row above it — the other repeated pattern
 * (label on the left, value on the right, bar underneath).
 */
export function LabeledProgress({
  label,
  value,
  caption,
  color = "#10b981",
  size = "sm",
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  /** Right-hand text. Defaults to the rounded percentage. */
  caption?: string;
  color?: string;
  size?: Size;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted">
          {Icon && <Icon className="size-3.5" style={{ color }} />}
          {label}
        </span>
        <span className="tabular font-medium">{caption ?? `${Math.round(value)}%`}</span>
      </div>
      <ProgressBar value={value} color={color} size={size} label={label} />
    </div>
  );
}
