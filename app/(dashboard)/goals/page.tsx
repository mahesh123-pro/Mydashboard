"use client";

import { motion } from "framer-motion";
import { Target, Rocket, Dumbbell, Wallet, GraduationCap, Heart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

const GOALS = [
  { title: "Ship 3 production products", cat: "Career", icon: Rocket, color: "#10b981", pct: 66, due: "Dec 2026", term: "Long" },
  { title: "Land a remote SDE role", cat: "Career", icon: Rocket, color: "#10b981", pct: 40, due: "Q3 2026", term: "Short" },
  { title: "Reach 12% body fat", cat: "Fitness", icon: Dumbbell, color: "#ef4444", pct: 58, due: "Oct 2026", term: "Short" },
  { title: "Deadlift 180kg", cat: "Fitness", icon: Dumbbell, color: "#ef4444", pct: 83, due: "Sep 2026", term: "Short" },
  { title: "₹1,00,000 / mo freelance", cat: "Financial", icon: Wallet, color: "#22c55e", pct: 45, due: "2027", term: "Long" },
  { title: "6-month emergency fund", cat: "Financial", icon: Wallet, color: "#22c55e", pct: 60, due: "Mar 2027", term: "Long" },
  { title: "AWS + Kubernetes certified", cat: "Learning", icon: GraduationCap, color: "#f59e0b", pct: 72, due: "Aug 2026", term: "Short" },
  { title: "Read 24 books this year", cat: "Personal", icon: Heart, color: "#ec4899", pct: 54, due: "Dec 2026", term: "Long" },
];

const VISION = ["Financial freedom", "Own a startup", "Elite fitness", "Travel Japan", "Mentor others", "Deep focus life"];

export default function GoalsPage() {
  const shortTerm = GOALS.filter((g) => g.term === "Short").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Target} title="Goals" subtitle="Design the life you want." accent="#22c55e" />

      <GlassCard className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle,#059669,transparent 60%)" }} />
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <Sparkles className="size-4 text-secondary" /> Vision Board
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {VISION.map((v, i) => (
            <motion.span
              key={v}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
            >
              {v}
            </motion.span>
          ))}
        </div>
      </GlassCard>

      <div className="flex items-center gap-3 text-sm text-muted">
        <Badge color="#14b8a6">{shortTerm} short-term</Badge>
        <Badge color="#059669">{GOALS.length - shortTerm} long-term</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {GOALS.map((g, i) => (
          <motion.div key={g.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <GlassCard hover className="p-6">
              <div className="flex items-start justify-between">
                <div className="grid size-10 place-items-center rounded-field" style={{ background: `${g.color}1f`, color: g.color }}>
                  <g.icon className="size-5" />
                </div>
                <Badge color={g.color}>{g.cat}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug">{g.title}</h3>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-2xs text-muted-2">
                  <span>Target · {g.due}</span>
                  <span className="tabular">{g.pct}%</span>
                </div>
                <ProgressBar value={g.pct} color={g.color} size="md" label={g.title} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
