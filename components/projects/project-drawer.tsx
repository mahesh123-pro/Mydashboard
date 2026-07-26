"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Clock, Check, GitBranch, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { useStore } from "@/lib/store";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ProjectDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const toggleMilestone = useStore((s) => s.toggleMilestone);

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="glass-strong fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col overflow-y-auto p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="mt-1 size-3 rounded-full" style={{ background: project.color }} />
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StatusBadge status={project.status} />
                    <PriorityBadge priority={project.priority} />
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-xl border border-border text-muted hover:text-foreground cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <MiniStat icon={CheckCircle2} label="Progress" value={`${project.progress}%`} />
              <MiniStat icon={Clock} label="Time" value={`${project.timeSpentH}h`} />
              <MiniStat icon={Check} label="Tasks" value={`${project.tasksDone}/${project.tasksTotal}`} />
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
                <span>Overall progress</span>
                <span className="tabular font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: project.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-2">Tech stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-lg border border-border bg-white/[0.03] px-2 py-1 text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex-1">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-2">Milestones</h3>
              <div className="space-y-1.5">
                {project.milestones.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => toggleMilestone(project.id, i)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-2.5 text-left transition-colors hover:border-border-strong"
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
                        m.done ? "border-transparent bg-success text-white" : "border-border-strong text-transparent",
                      )}
                    >
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className={cn("text-sm", m.done && "text-muted-2 line-through")}>{m.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {(project.repo || project.deploy) && (
              <div className="mt-5 flex gap-2">
                {project.repo && (
                  <a
                    href={`https://${project.repo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border-strong text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <GitBranch className="size-4" /> Repo
                  </a>
                )}
                {project.deploy && (
                  <a
                    href={`https://${project.deploy}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-sm font-medium text-white"
                  >
                    <ExternalLink className="size-4" /> Live
                  </a>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-2.5 text-center">
      <Icon className="mx-auto size-4 text-muted-2" />
      <div className="mt-1 text-sm font-semibold tabular">{value}</div>
      <div className="text-[10px] text-muted-2">{label}</div>
    </div>
  );
}
