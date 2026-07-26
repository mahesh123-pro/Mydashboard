"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  delta,
  accent = "#10b981",
  sub,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  delta?: number;
  accent?: string;
  sub?: string;
  className?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <GlassCard hover className={cn("group relative overflow-hidden p-5", className)}>
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div
          className="grid size-10 place-items-center rounded-xl"
          style={{ background: `${accent}1f`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}33` }}
        >
          <Icon className="size-5" />
        </div>
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              up ? "text-success bg-success/10" : "text-danger bg-danger/10",
            )}
          >
            {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold tracking-tight">
          <AnimatedNumber
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
            format={format}
          />
        </div>
        <div className="mt-0.5 text-sm text-muted">{label}</div>
        {sub && <div className="mt-1 text-xs text-muted-2">{sub}</div>}
      </div>
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </GlassCard>
  );
}
