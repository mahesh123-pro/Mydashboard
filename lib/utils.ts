import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ----------------------------- formatters ----------------------------- */

const LOCALE_MAP: Record<string, string> = {
  INR: "en-IN", USD: "en-US", EUR: "de-DE", GBP: "en-GB",
  JPY: "ja-JP", AUD: "en-AU", CAD: "en-CA",
};

export function formatCurrency(n: number, currency = "INR", compact = false) {
  const locale = LOCALE_MAP[currency] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(n);
}

export function formatNumber(n: number, compact = false) {
  return new Intl.NumberFormat("en-IN", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

export function pct(value: number, total: number) {
  if (!total) return 0;
  return clamp(Math.round((value / total) * 100));
}

/* ------------------------------ time ------------------------------ */

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

/** Subsequence fuzzy match. Returns a score (higher = better) or -1 if no match. */
export function fuzzyScore(query: string, text: string) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t.includes(q)) return 100 - t.indexOf(q) + (t.startsWith(q) ? 20 : 0);
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      streak++;
      score += 1 + streak * 0.6 + (ti === 0 ? 3 : 0);
    } else {
      streak = 0;
    }
  }
  if (qi < q.length) return -1;
  return score + Math.max(0, 8 - t.length * 0.05);
}

export function relativeTime(ts: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.round(d / 7);
  return `${w}w ago`;
}

export function dayKey(date = new Date()) {
  // Local YYYY-MM-DD (stable key for daily tracking)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* --------------------------- gamification --------------------------- */

/** XP required to reach a given level (mild exponential curve). */
export function xpForLevel(level: number) {
  return Math.round(120 * Math.pow(level, 1.5));
}

export function levelFromXp(xp: number) {
  let level = 1;
  while (level < 200 && totalXpForLevel(level + 1) <= xp) {
    level++;
  }
  // total xp needed to be at `level`
  const totalForCurrent = totalXpForLevel(level);
  const totalForNext = totalXpForLevel(level + 1);
  const into = xp - totalForCurrent;
  const span = totalForNext - totalForCurrent;
  return {
    level,
    into,
    span,
    progress: clamp(Math.round((into / span) * 100)),
  };
}

export function totalXpForLevel(level: number) {
  let sum = 0;
  for (let i = 2; i <= level; i++) sum += xpForLevel(i);
  return sum;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
