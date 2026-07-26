"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl border border-border bg-white/[0.03] p-1", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              active ? "text-white" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${options.map((x) => x.value).join("")}`}
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
