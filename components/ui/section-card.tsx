"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";

/**
 * A titled content card.
 *
 * Roughly 25 call sites hand-rolled this header — `<h3 className="mb-4 text-sm
 * font-semibold text-muted">` in some files, an icon+flex variant in others,
 * with the body spacing varying between mt-3, mt-4 and mt-5. Consolidating it
 * makes every section header identical and gives each card a real heading
 * element for screen readers.
 */
export function SectionCard({
  icon: Icon,
  iconColor,
  title,
  description,
  action,
  children,
  /** Pinned below the body — composers, "view all" rows, totals. */
  footer,
  /** Stretch to the height of its grid row and let the body take the slack. */
  fill = false,
  /** Scroll the body instead of growing the card. */
  scroll = false,
  hover = false,
  variant,
  className,
  bodyClassName,
}: {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  fill?: boolean;
  scroll?: boolean;
  hover?: boolean;
  variant?: "panel" | "glass" | "glass-strong";
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <GlassCard
      variant={variant}
      hover={hover}
      className={cn("flex flex-col p-6", fill && "h-full", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold leading-6">
            {Icon && (
              <Icon
                className="size-4 shrink-0"
                style={iconColor ? { color: iconColor } : undefined}
                aria-hidden
              />
            )}
            <span className="truncate">{title}</span>
          </h3>
          {description && <p className="mt-0.5 text-2xs text-muted-2">{description}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>

      <div
        className={cn(
          "mt-4",
          fill && "flex-1",
          scroll && "no-scrollbar min-h-0 overflow-y-auto",
          bodyClassName,
        )}
      >
        {children}
      </div>

      {footer && <div className="mt-4 shrink-0">{footer}</div>}
    </GlassCard>
  );
}

/**
 * An inset tile — the "card inside a card" surface. Replaces the
 * `rounded-2xl border border-border bg-white/[0.02] p-4` string that appeared
 * ~30 times and was invisible in light mode.
 */
export function Tile({
  children,
  className,
  hover = false,
  as: As = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <As
      className={cn(
        "rounded-tile border border-border bg-surface",
        hover && "transition-colors hover:border-border-strong hover:bg-surface-hover",
        className,
      )}
      {...props}
    >
      {children}
    </As>
  );
}
