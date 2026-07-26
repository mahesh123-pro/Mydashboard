import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8" : "py-14",
        className,
      )}
    >
      <div className="grid size-12 place-items-center rounded-2xl border border-border bg-white/[0.03] text-muted-2">
        <Icon className="size-6" />
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-xs text-xs text-muted-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
