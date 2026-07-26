"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { seedInsights } from "@/lib/data/seed";
import { getIcon } from "@/lib/icon-map";

export function AIInsights() {
  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6">
      <div
        className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #059669, transparent 60%)" }}
      />
      <div className="relative flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-6 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="size-3.5 text-white" />
          </span>
          AI Morning Brief
        </h3>
        <Link
          href="/assistant"
          className="inline-flex items-center gap-1 text-[11px] text-muted-2 transition-colors hover:text-foreground"
        >
          Open Assistant <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        {seedInsights.map((ins, i) => {
          const Icon = getIcon(ins.icon);
          return (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.4 }}
              className="flex gap-3 rounded-2xl border border-border bg-white/[0.02] p-3.5"
            >
              <div
                className="grid size-9 shrink-0 place-items-center rounded-xl"
                style={{ background: `${ins.color}1f`, color: ins.color, boxShadow: `inset 0 0 0 1px ${ins.color}33` }}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold">{ins.title}</div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{ins.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
