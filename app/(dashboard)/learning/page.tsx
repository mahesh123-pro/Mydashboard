"use client";

import { GraduationCap, Cloud, Boxes, Code2, Brain, Award, Clock, Gauge, Plug } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { GithubWidget, LeetcodeWidget, SpotifyWidget } from "@/components/integrations/integrations";

const TRACKS = [
  {
    name: "Cloud",
    icon: Cloud,
    color: "#f59e0b",
    skills: [
      { name: "AWS", pct: 72 },
      { name: "Azure", pct: 40 },
      { name: "Google Cloud", pct: 26 },
    ],
  },
  {
    name: "DevOps",
    icon: Boxes,
    color: "#14b8a6",
    skills: [
      { name: "Docker", pct: 82 },
      { name: "Kubernetes", pct: 55 },
      { name: "Terraform", pct: 45 },
      { name: "Linux", pct: 78 },
    ],
  },
  {
    name: "Programming",
    icon: Code2,
    color: "#10b981",
    skills: [
      { name: "TypeScript", pct: 90 },
      { name: "React / Next.js", pct: 88 },
      { name: "Node.js", pct: 80 },
      { name: "Python", pct: 74 },
      { name: "SQL / Mongo", pct: 71 },
    ],
  },
  {
    name: "AI",
    icon: Brain,
    color: "#059669",
    skills: [
      { name: "Prompt Engineering", pct: 86 },
      { name: "LLMs & RAG", pct: 70 },
      { name: "OpenAI / Claude APIs", pct: 68 },
    ],
  },
];

const CERTS = [
  { name: "AWS Solutions Architect", status: "In progress · 72%", color: "#f59e0b" },
  { name: "Docker Certified Associate", status: "Earned", color: "#22c55e" },
  { name: "Meta Front-End", status: "Earned", color: "#22c55e" },
  { name: "CKA (Kubernetes)", status: "Planned", color: "#a1a1aa" },
];

export default function LearningPage() {
  const all = TRACKS.flatMap((t) => t.skills);
  const avg = Math.round(all.reduce((a, s) => a + s.pct, 0) / all.length);

  return (
    <div className="space-y-5">
      <PageHeader icon={GraduationCap} title="Learning" subtitle="Cloud · Programming · AI" accent="#f59e0b" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Boxes} label="Active tracks" value={TRACKS.length} accent="#14b8a6" />
        <StatCard icon={Award} label="Certificates" value={2} sub="+2 in progress" accent="#22c55e" />
        <StatCard icon={Gauge} label="Avg mastery" value={avg} suffix="%" accent="#10b981" />
        <StatCard icon={Clock} label="Hours this month" value={48} accent="#059669" />
      </div>

      <div>
        <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <Plug className="size-4 text-accent" /> Integrations
        </h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <GithubWidget />
          <LeetcodeWidget />
          <SpotifyWidget />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {TRACKS.map((t) => (
          <GlassCard key={t.name} hover className="p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl" style={{ background: `${t.color}1f`, color: t.color }}>
                <t.icon className="size-4" />
              </div>
              <h3 className="text-sm font-semibold">{t.name}</h3>
            </div>
            <div className="space-y-3">
              {t.skills.map((sk) => (
                <div key={sk.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted">{sk.name}</span>
                    <span className="tabular text-muted-2">{sk.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${sk.pct}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}99)` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <Award className="size-4 text-warning" /> Certifications & Roadmap
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CERTS.map((c) => (
            <div key={c.name} className="rounded-2xl border border-border bg-white/[0.02] p-4">
              <div className="grid size-9 place-items-center rounded-xl" style={{ background: `${c.color}1f`, color: c.color }}>
                <Award className="size-4" />
              </div>
              <div className="mt-3 text-sm font-medium">{c.name}</div>
              <div className="mt-1 text-[11px] text-muted-2">{c.status}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
