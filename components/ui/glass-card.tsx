import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "panel" | "glass" | "glass-strong";

const VARIANT: Record<Variant, string> = {
  /** Solid content surface — the default for anything inside the page body. */
  panel: "panel",
  /** Translucent — floating chrome only (sidebar, topbar, drawers). */
  glass: "glass",
  "glass-strong": "glass-strong",
};

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: Variant;
  /** @deprecated use `variant="glass-strong"`. */
  strong?: boolean;
}

export function GlassCard({
  className,
  hover = false,
  variant = "panel",
  strong = false,
  children,
  ...props
}: GlassCardProps) {
  const resolved: Variant = strong ? "glass-strong" : variant;
  return (
    <div
      className={cn(VARIANT[resolved], "rounded-panel", hover && "card-hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Preferred name going forward — `GlassCard` is kept for existing call sites. */
export const Card = GlassCard;
