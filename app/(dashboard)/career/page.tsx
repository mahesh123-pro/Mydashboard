"use client";

import { GraduationCap, FileText, Mic, Trophy, Code2, Network, Users2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";

const PREP = [
  { name: "DSA / Coding", icon: Code2, pct: 78, color: "#10b981" },
  { name: "System Design", icon: Network, pct: 62, color: "#14b8a6" },
  { name: "Behavioral", icon: Users2, pct: 85, color: "#22c55e" },
];
const SKILLS = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "System Design", "REST", "GraphQL", "Prisma", "Tailwind", "CI/CD"];
const RESUMES = [
  { name: "SDE — Full-stack (v4)", note: "Tailored · ATS 92%" },
  { name: "Frontend Engineer (v2)", note: "React-focused" },
  { name: "Cloud / DevOps (v1)", note: "AWS-focused" },
];

export default function CareerPage() {
  return (
    <div className="space-y-5">
      <PageHeader icon={GraduationCap} title="Career" subtitle="Sharpen the edge." accent="#10b981" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Code2} label="Core skills" value={SKILLS.length} accent="#10b981" />
        <StatCard icon={FileText} label="Resume versions" value={RESUMES.length} accent="#14b8a6" />
        <StatCard icon={Mic} label="Mock interviews" value={12} accent="#f59e0b" />
        <StatCard icon={Trophy} label="Achievements" value={7} accent="#22c55e" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-muted">Interview Preparation</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {PREP.map((p) => (
              <div key={p.name} className="rounded-2xl border border-border bg-white/[0.02] p-4">
                <div className="grid size-9 place-items-center rounded-xl" style={{ background: `${p.color}1f`, color: p.color }}>
                  <p.icon className="size-4" />
                </div>
                <div className="mt-3 text-sm font-medium">{p.name}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <div className="mt-1 text-[11px] text-muted-2 tabular">{p.pct}% ready</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <FileText className="size-4 text-accent" /> Resume Versions
          </h3>
          <div className="space-y-2">
            {RESUMES.map((r) => (
              <div key={r.name} className="rounded-xl border border-border bg-white/[0.02] p-3">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-2">{r.note}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-muted">Skill Cloud</h3>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((sk) => (
            <span key={sk} className="rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground hover:border-border-strong">
              {sk}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
