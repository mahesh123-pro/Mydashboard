"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { seedInsights } from "@/lib/data/seed";
import { getIcon } from "@/lib/icon-map";
import { SectionCard } from "@/components/ui/section-card";

export function AIInsights() {
  return (
    <SectionCard
      icon={Sparkles}
      iconColor="var(--color-primary)"
      title="AI Morning Brief"
      description="Patterns picked out of this week's data"
      action={
        <Link
          href="/assistant"
          className="inline-flex items-center gap-1 text-2xs text-muted-2 transition-colors hover:text-foreground"
        >
          Open Assistant <ArrowRight className="size-3" aria-hidden />
        </Link>
      }
      bodyClassName="grid gap-3 sm:grid-cols-2"
    >
        {seedInsights.map((ins, i) => {
          const Icon = getIcon(ins.icon);
          return (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.4 }}
              className="flex gap-3 rounded-tile border border-border bg-surface p-3.5"
            >
              <div
                className="grid size-9 shrink-0 place-items-center rounded-field"
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
    </SectionCard>
  );
}
