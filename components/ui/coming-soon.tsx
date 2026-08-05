"use client";

import { motion } from "framer-motion";
import { Sparkles, type LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  features,
  note = "This module is on the v2 roadmap. The design system, data model and navigation are ready — full interactivity lands next.",
}: {
  icon: LucideIcon;
  features: string[];
  note?: string;
}) {
  return (
    <div className="panel relative mt-6 overflow-hidden rounded-panel p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #10b981, transparent 60%)" }}
      />
      <div className="relative flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid size-16 place-items-center rounded-tile bg-gradient-to-br from-primary/20 to-secondary/20 text-primary"
          style={{ boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.3)" }}
        >
          <Icon className="size-8" />
        </motion.div>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-2xs font-medium text-muted">
          <Sparkles className="size-3 text-secondary" /> Coming in v2
        </div>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{note}</p>

        <div className="mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-2 rounded-field border border-border bg-surface px-3 py-2.5 text-left text-xs text-muted"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
