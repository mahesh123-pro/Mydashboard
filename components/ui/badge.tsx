import { cn } from "@/lib/utils";
import type { Priority, ProjectStatus, JobStatus } from "@/lib/types";

export function Badge({
  children,
  className,
  color = "#10b981",
  soft = true,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  soft?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-5 whitespace-nowrap",
        className,
      )}
      style={
        soft
          ? { color, backgroundColor: `${color}1f`, boxShadow: `inset 0 0 0 1px ${color}33` }
          : { color: "#fff", backgroundColor: color }
      }
    >
      {children}
    </span>
  );
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low: "#71717a",
  medium: "#14b8a6",
  high: "#f59e0b",
  urgent: "#ef4444",
};
export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge color={PRIORITY_COLOR[priority]}>
      <span className="capitalize">{priority}</span>
    </Badge>
  );
}

const STATUS_COLOR: Record<ProjectStatus, string> = {
  planning: "#a1a1aa",
  active: "#22c55e",
  paused: "#f59e0b",
  shipped: "#10b981",
};
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge color={STATUS_COLOR[status]}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: STATUS_COLOR[status] }} />
      <span className="capitalize">{status}</span>
    </Badge>
  );
}

const JOB_COLOR: Record<JobStatus, string> = {
  saved: "#a1a1aa",
  applied: "#14b8a6",
  interview: "#f59e0b",
  offer: "#22c55e",
  rejected: "#ef4444",
};
export function JobBadge({ status }: { status: JobStatus }) {
  return (
    <Badge color={JOB_COLOR[status]}>
      <span className="capitalize">{status}</span>
    </Badge>
  );
}
