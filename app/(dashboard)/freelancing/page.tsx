"use client";

import { Handshake, IndianRupee, Users, FileSignature, Trophy } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const PLATFORMS = [
  { name: "Upwork", earned: 186000, color: "#22c55e" },
  { name: "Fiverr", earned: 74000, color: "#14b8a6" },
  { name: "LinkedIn", earned: 128000, color: "#10b981" },
  { name: "Contra", earned: 42000, color: "#059669" },
];
const CLIENTS = [
  { name: "Bloom Studio", value: 95000, status: "active" },
  { name: "NovaTech", value: 148000, status: "active" },
  { name: "GreenLeaf Org", value: 60000, status: "completed" },
  { name: "PixelForge", value: 52000, status: "completed" },
];

export default function FreelancingPage() {
  const total = PLATFORMS.reduce((a, p) => a + p.earned, 0);

  return (
    <div className="space-y-5">
      <PageHeader icon={Handshake} title="Freelancing" subtitle="Clients, projects & revenue." accent="#059669" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total revenue" value={total} format={(n) => formatCurrency(n, "INR", true)} delta={12} accent="#22c55e" />
        <StatCard icon={Users} label="Active clients" value={2} accent="#10b981" />
        <StatCard icon={FileSignature} label="Proposals sent" value={34} sub="9 this month" accent="#f59e0b" />
        <StatCard icon={Trophy} label="Win rate" value={38} suffix="%" accent="#14b8a6" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted">Earnings by Platform</h3>
          <div className="space-y-3">
            {PLATFORMS.map((p) => {
              const pct = Math.round((p.earned / total) * 100);
              return (
                <div key={p.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted">{p.name}</span>
                    <span className="tabular font-medium">{formatCurrency(p.earned, "INR", true)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-sm font-semibold text-muted">Top Clients</h3>
          <div className="space-y-2">
            {CLIENTS.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-semibold text-primary">
                  {c.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{c.name}</div>
                  <div className="text-[11px] text-muted-2">{formatCurrency(c.value)} lifetime</div>
                </div>
                <Badge color={c.status === "active" ? "#22c55e" : "#a1a1aa"}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
