"use client";

import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, PiggyBank, Plus, Receipt, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useHydrated } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import { buildNetWorth, spendingByCategory } from "@/lib/data/seed";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaTrend, Donut } from "@/components/charts/charts";

export default function FinancesPage() {
  const hydrated = useHydrated();
  const finance = useStore((s) => s.finance);
  const subscriptions = useStore((s) => s.subscriptions);
  const savingsGoals = useStore((s) => s.savingsGoals);
  const transactions = useStore((s) => s.transactions);
  const addToSavings = useStore((s) => s.addToSavings);

  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const savingsRate = Math.round(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome) * 100);
  const netWorth = buildNetWorth().map((p) => ({ date: p.date, value: p.value }));
  const subsTotal = subscriptions.reduce((a, s) => a + (s.cycle === "monthly" ? s.amount : s.amount / 12), 0);

  return (
    <div className="space-y-5">
      <PageHeader icon={Wallet} title="Finances" subtitle="Money, mastered." accent="#22c55e" />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Net worth" value={finance.netWorth} format={(n) => formatCurrency(n, "INR", true)} delta={8.4} accent="#22c55e" />
        <StatCard icon={ArrowUpRight} label="Monthly income" value={finance.monthlyIncome} format={(n) => formatCurrency(n)} accent="#10b981" />
        <StatCard icon={ArrowDownRight} label="Monthly expenses" value={finance.monthlyExpenses} format={(n) => formatCurrency(n)} accent="#ef4444" />
        <StatCard icon={PiggyBank} label="Savings rate" value={savingsRate} suffix="%" accent="#14b8a6" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted">Net Worth · 12 months</h3>
            <span className="text-sm font-semibold text-success">{formatCurrency(finance.netWorth, "INR", true)}</span>
          </div>
          <AreaTrend data={netWorth} from="#22c55e" to="#14b8a6" prefix="₹" height={240} />
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-2 text-sm font-semibold text-muted">Spending Breakdown</h3>
          <Donut data={spendingByCategory} height={190} />
          <div className="mt-3 space-y-1.5">
            {spendingByCategory.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-muted">
                  <span className="size-2 rounded-full" style={{ background: c.color }} /> {c.name}
                </span>
                <span className="tabular font-medium">{formatCurrency(c.value)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Savings goals */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <PiggyBank className="size-4 text-accent" /> Savings Goals
          </h3>
          <div className="space-y-4">
            {savingsGoals.map((g) => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium">{g.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="tabular text-xs text-muted">
                        {formatCurrency(g.saved, "INR", true)} / {formatCurrency(g.target, "INR", true)}
                      </span>
                      <button
                        onClick={() => {
                          addToSavings(g.id, 5000);
                          toast.success(`Added ₹5,000 to ${g.name}`);
                        }}
                        className="grid size-6 place-items-center rounded-lg bg-accent/15 text-accent transition-colors hover:bg-accent/25 cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Subscriptions */}
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
              <CreditCard className="size-4 text-secondary" /> Subscriptions
            </h3>
            <span className="tabular text-xs text-muted-2">{formatCurrency(subsTotal)}/mo</span>
          </div>
          <div className="space-y-1.5">
            {subscriptions.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-white/[0.02] px-3 py-2">
                <div>
                  <div className="text-sm">{s.name}</div>
                  <div className="text-[10px] text-muted-2">{s.category}</div>
                </div>
                <span className="tabular text-sm font-medium">{formatCurrency(s.amount)}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Transactions */}
      <GlassCard className="p-6">
        <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted">
          <Receipt className="size-4 text-primary" /> Recent Transactions
        </h3>
        <div className="space-y-1">
          {transactions.map((t) => {
            const income = t.amount > 0;
            return (
              <div key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]">
                <div
                  className={cn("grid size-9 place-items-center rounded-xl", income ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}
                >
                  {income ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{t.label}</div>
                  <div className="text-[11px] text-muted-2">
                    {t.category} · {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
                <span className={cn("tabular text-sm font-semibold", income ? "text-success" : "text-foreground")}>
                  {income ? "+" : ""}
                  {formatCurrency(Math.abs(t.amount))}
                </span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
