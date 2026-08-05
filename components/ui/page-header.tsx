"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  eyebrow,
  accent = "#10b981",
  actions,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  accent?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex flex-wrap items-end justify-between gap-4", className)}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div
            className="grid size-11 shrink-0 place-items-center rounded-tile"
            style={{ background: `${accent}17`, color: accent, boxShadow: `inset 0 0 0 1px ${accent}2e` }}
          >
            <Icon className="size-[22px]" />
          </div>
        )}
        <div>
          {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
          <h1 className="font-display text-display-sm sm:text-display-md">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.header>
  );
}
