import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  strong?: boolean;
  inset?: boolean;
}

export function GlassCard({
  className,
  hover = false,
  strong = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl",
        hover && "card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
