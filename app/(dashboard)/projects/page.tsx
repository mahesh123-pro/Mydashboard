"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, GitBranch, ExternalLink, Clock, Rocket, Layers, Gauge } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import type { Project, ProjectStatus } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/segmented";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectDrawer } from "@/components/projects/project-drawer";

type Filter = "all" | ProjectStatus;

export default function ProjectsPage() {
  const hydrated = useHydrated();
  const projects = useStore((s) => s.projects);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const shown = filter === "all" ? projects : projects.filter((p) => p.status === filter);
  const active = projects.filter((p) => p.status === "active").length;
  const shipped = projects.filter((p) => p.status === "shipped").length;
  const hours = projects.reduce((a, p) => a + p.timeSpentH, 0);
  const avg = Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length);

  // keep drawer in sync if store updates (milestone toggle)
  const selectedLive = selected ? projects.find((p) => p.id === selected.id) ?? null : null;

  return (
    <div className="space-y-5">
      <PageHeader
        icon={FolderKanban}
        title="Projects"
        subtitle="From idea to deployment."
        accent="#10b981"
        actions={
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Planning", value: "planning" },
              { label: "Shipped", value: "shipped" },
            ]}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Layers} label="Active projects" value={active} accent="#22c55e" />
        <StatCard icon={Rocket} label="Shipped" value={shipped} accent="#10b981" />
        <StatCard icon={Clock} label="Total hours" value={hours} accent="#f59e0b" />
        <StatCard icon={Gauge} label="Avg progress" value={avg} suffix="%" accent="#14b8a6" />
      </div>

      {shown.length === 0 && (
        <GlassCard className="p-6">
          <EmptyState icon={FolderKanban} title={`No ${filter} projects`} description="Nothing here yet — switch the filter or start something new." />
        </GlassCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((p, i) => (
          <motion.button
            key={p.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setSelected(p)}
            className="glass card-hover group relative overflow-hidden rounded-3xl p-5 text-left"
          >
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: p.color }} />
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full" style={{ background: p.color }} />
                <h3 className="font-semibold tracking-tight">{p.name}</h3>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{p.description}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted-2">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-2">
                <span>{p.tasksDone}/{p.tasksTotal} tasks</span>
                <span className="tabular">{p.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <PriorityBadge priority={p.priority} />
              <div className="flex items-center gap-2 text-muted-2">
                {p.repo && <GitBranch className="size-3.5" />}
                {p.deploy && <ExternalLink className="size-3.5" />}
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <Clock className="size-3" /> {p.timeSpentH}h
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <ProjectDrawer project={selectedLive} onClose={() => setSelected(null)} />
    </div>
  );
}
