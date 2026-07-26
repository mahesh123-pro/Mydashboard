"use client";

import { motion } from "framer-motion";
import { Briefcase, Send, CalendarCheck, Trophy, MapPin, Wifi, Building2 } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobBadge } from "@/components/ui/badge";

export default function JobsPage() {
  const hydrated = useHydrated();
  const jobs = useStore((s) => s.jobs);
  const cycleJob = useStore((s) => s.cycleJob);

  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const applied = jobs.filter((j) => j.status !== "saved").length;
  const interviews = jobs.filter((j) => j.status === "interview").length;
  const offers = jobs.filter((j) => j.status === "offer").length;
  const responseRate = applied ? Math.round(((interviews + offers) / applied) * 100) : 0;

  return (
    <div className="space-y-5">
      <PageHeader icon={Briefcase} title="Job Tracker" subtitle="Every opportunity, in one pipeline." accent="#10b981" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Send} label="Applications" value={applied} accent="#14b8a6" />
        <StatCard icon={CalendarCheck} label="Interviews" value={interviews} accent="#f59e0b" />
        <StatCard icon={Trophy} label="Offers" value={offers} accent="#22c55e" />
        <StatCard icon={Building2} label="Response rate" value={responseRate} suffix="%" accent="#059669" />
      </div>

      <GlassCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted">Applications</h3>
          <span className="text-[11px] text-muted-2">Tap a status to advance the stage →</span>
        </div>
        <div className="space-y-2">
          {jobs.map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white/[0.02] p-4"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-semibold text-primary">
                {j.company.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{j.role}</span>
                  <span className="text-muted-2">·</span>
                  <span className="text-sm text-muted">{j.company}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-2">
                  <span className="inline-flex items-center gap-1">
                    {j.remote ? <Wifi className="size-3" /> : <MapPin className="size-3" />}
                    {j.location}
                  </span>
                  {j.salary && <span>{j.salary}</span>}
                  {j.platform && <span>via {j.platform}</span>}
                  {j.appliedDate && (
                    <span>{new Date(j.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  )}
                </div>
              </div>
              <button onClick={() => cycleJob(j.id)} className="cursor-pointer">
                <JobBadge status={j.status} />
              </button>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
