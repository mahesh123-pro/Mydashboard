"use client";

import { useEffect, useState } from "react";
import { GitBranch, Code2, Music, Plug, ExternalLink, RefreshCw, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";

/* ------------------------------- shell -------------------------------- */
function Shell({
  name,
  icon: Icon,
  color,
  connected,
  children,
  right,
}: {
  name: string;
  icon: LucideIcon;
  color: string;
  connected: boolean;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <GlassCard className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-field" style={{ background: `${color}1f`, color }}>
            <Icon className="size-4" />
          </div>
          <h3 className="text-sm font-semibold">{name}</h3>
        </div>
        {right ?? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-3xs"
            style={{
              color: connected ? "#22c55e" : "#a1a1aa",
              background: connected ? "#22c55e1a" : "var(--surface-hover)",
            }}
          >
            <span className="size-1.5 rounded-full" style={{ background: connected ? "#22c55e" : "#a1a1aa" }} />
            {connected ? "Connected" : "Not connected"}
          </span>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </GlassCard>
  );
}

function Connect({ envVar, hint }: { envVar?: string; hint: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-6 text-center">
      <div className="grid size-11 place-items-center rounded-tile border border-border bg-surface text-muted-2">
        <Plug className="size-5" />
      </div>
      <p className="mt-3 max-w-[15rem] text-xs text-muted-2">{hint}</p>
      {envVar && (
        <code className="mt-3 rounded-control border border-border bg-surface px-2.5 py-1 font-mono text-2xs text-muted">
          {envVar}
        </code>
      )}
    </div>
  );
}

/* ------------------------------- github ------------------------------- */
type GhData = { total: number; weeks: { level: number }[][] };

const GH_LEVELS = ["var(--track)", "#22c55e40", "#22c55e73", "#22c55eb3", "#22c55e"];

export function GithubWidget() {
  const user = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const [data, setData] = useState<GhData | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ok">("loading");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        setState("loading");
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const contribs: { date: string; count: number; level: number }[] = json.contributions ?? [];
        const recent = contribs.slice(-119); // ~17 weeks
        const weeks: { level: number }[][] = [];
        for (let i = 0; i < recent.length; i += 7) weeks.push(recent.slice(i, i + 7));
        const total = Object.values(json.total ?? {})[0] as number;
        if (!cancelled) {
          setData({ total: total ?? recent.reduce((a, c) => a + c.count, 0), weeks });
          setState("ok");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <Shell
      name="GitHub"
      icon={GitBranch}
      color="#a1a1aa"
      connected={!!user && state === "ok"}
      right={
        user ? (
          <a href={`https://github.com/${user}`} target="_blank" rel="noreferrer" className="text-muted-2 transition-colors hover:text-foreground">
            <ExternalLink className="size-3.5" />
          </a>
        ) : undefined
      }
    >
      {!user ? (
        <Connect envVar="NEXT_PUBLIC_GITHUB_USERNAME" hint="Add your GitHub username to show your live contribution graph." />
      ) : state === "loading" ? (
        <div className="skeleton h-24 w-full rounded-field" />
      ) : state === "error" ? (
        <div className="flex h-full items-center justify-center gap-2 py-6 text-xs text-muted-2">
          <RefreshCw className="size-3.5" /> Couldn&apos;t load contributions
        </div>
      ) : (
        <div>
          <div className="mb-3 text-2xl font-semibold tabular">
            {data!.total.toLocaleString()} <span className="text-xs font-normal text-muted-2">contributions / yr</span>
          </div>
          <div className="flex gap-[3px] overflow-hidden">
            {data!.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <span key={di} className="size-[9px] rounded-[2px]" style={{ background: GH_LEVELS[day.level] }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}

/* ------------------------------ leetcode ------------------------------ */
type LcData = { total: number; easy: number; medium: number; hard: number; ranking: number };

export function LeetcodeWidget() {
  const user = process.env.NEXT_PUBLIC_LEETCODE_USERNAME;
  const [data, setData] = useState<LcData | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ok">("loading");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        setState("loading");
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${user}`);
        const json = await res.json();
        if (json.status !== "success") throw new Error();
        if (!cancelled) {
          setData({
            total: json.totalSolved,
            easy: json.easySolved,
            medium: json.mediumSolved,
            hard: json.hardSolved,
            ranking: json.ranking,
          });
          setState("ok");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const rows = data
    ? [
        { label: "Easy", value: data.easy, color: "#22c55e" },
        { label: "Medium", value: data.medium, color: "#f59e0b" },
        { label: "Hard", value: data.hard, color: "#ef4444" },
      ]
    : [];
  const max = data ? Math.max(data.easy, data.medium, data.hard, 1) : 1;

  return (
    <Shell name="LeetCode" icon={Code2} color="#f59e0b" connected={!!user && state === "ok"}>
      {!user ? (
        <Connect envVar="NEXT_PUBLIC_LEETCODE_USERNAME" hint="Add your LeetCode username to track solved problems and ranking." />
      ) : state === "loading" ? (
        <div className="skeleton h-24 w-full rounded-field" />
      ) : state === "error" ? (
        <div className="flex h-full items-center justify-center gap-2 py-6 text-xs text-muted-2">
          <RefreshCw className="size-3.5" /> Couldn&apos;t load stats
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-end justify-between">
            <div className="text-2xl font-semibold tabular">
              {data!.total} <span className="text-xs font-normal text-muted-2">solved</span>
            </div>
            <div className="text-2xs text-muted-2">Rank #{data!.ranking.toLocaleString()}</div>
          </div>
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.label}>
                <div className="mb-1 flex justify-between text-2xs">
                  <span className="text-muted">{r.label}</span>
                  <span className="tabular text-muted-2">{r.value}</span>
                </div>
                <ProgressBar value={(r.value / max) * 100} color={r.color} gradient={false} label={r.label} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}

/* ------------------------------ spotify ------------------------------- */
export function SpotifyWidget() {
  return (
    <Shell name="Spotify" icon={Music} color="#22c55e" connected={false}>
      <Connect hint="Spotify now-playing needs a one-time OAuth connection (client ID, secret & refresh token). Wire it up in v2 — no placeholder data shown until it's real." />
    </Shell>
  );
}
