"use client";

import { Library, GitBranch, FileText, Video, BookMarked, Link2, ExternalLink, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";

const SECTIONS: { title: string; icon: LucideIcon; color: string; items: { name: string; sub: string }[] }[] = [
  {
    title: "GitHub Repos",
    icon: GitBranch,
    color: "#10b981",
    items: [
      { name: "system-design-primer", sub: "Interview prep" },
      { name: "build-your-own-x", sub: "Learn by building" },
      { name: "awesome-nextjs", sub: "Curated Next.js" },
    ],
  },
  {
    title: "Cheat Sheets",
    icon: FileText,
    color: "#14b8a6",
    items: [
      { name: "Docker & K8s commands", sub: "PDF" },
      { name: "Git workflows", sub: "PDF" },
      { name: "Big-O complexity", sub: "PDF" },
    ],
  },
  {
    title: "Videos & Courses",
    icon: Video,
    color: "#ef4444",
    items: [
      { name: "AWS SAA full course", sub: "12h · in progress" },
      { name: "Neetcode 150", sub: "DSA playlist" },
      { name: "Next.js 15 deep dive", sub: "4h" },
    ],
  },
  {
    title: "Bookmarks",
    icon: BookMarked,
    color: "#22c55e",
    items: [
      { name: "Roadmap.sh", sub: "Learning paths" },
      { name: "Excalidraw", sub: "System diagrams" },
      { name: "Interview questions bank", sub: "500+ Qs" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader icon={Library} title="Resources" subtitle="Your knowledge store." accent="#14b8a6" />

      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <GlassCard key={s.title} className="p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-field" style={{ background: `${s.color}1f`, color: s.color }}>
                <s.icon className="size-4" />
              </div>
              <h3 className="text-sm font-semibold">{s.title}</h3>
            </div>
            <div className="space-y-2">
              {s.items.map((it) => (
                <div key={it.name} className="group flex items-center gap-3 rounded-field border border-border bg-surface p-3 transition-colors hover:border-border-strong">
                  <Link2 className="size-4 shrink-0 text-muted-2" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{it.name}</div>
                    <div className="text-2xs text-muted-2">{it.sub}</div>
                  </div>
                  <ExternalLink className="size-3.5 text-muted-2 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
