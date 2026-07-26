# Mahesh OS — Personal Operating System

A premium, futuristic "second brain" dashboard to run every area of life from one place —
health, projects, career, jobs, learning, finances, goals and habits. Minimal, glassmorphic,
dark-first, fast, with smooth motion and micro-interactions.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — design tokens in `app/globals.css`
- **Framer Motion** — page transitions, blob background, hover/press micro-interactions
- **Zustand** (+ persist) — all app state, saved to `localStorage`
- **Recharts** — charts · **cmdk** — ⌘K command palette · **lucide-react** — icons
- **next-themes** — dark/light · **sonner** — toasts

## What's in v1

Fully interactive, data persisted locally:

- **Dashboard** — greeting, live clock, weather, quote, progress ring, health stats,
  tasks, schedule, deadlines, activity, quick notes, AI morning brief
- **Habits** — daily toggles, streaks, GitHub-style heatmap, weekly chart
- **Gym** — body-weight/fat/BMI, strength log, PRs, workout timer, charts
- **Diet** — macro rings, macro-distribution donut, meal planner, water, supplements
- **Projects** — status/priority cards + detail drawer with milestone tracking
- **Finances** — net worth, spending breakdown, savings goals, subscriptions, transactions
- **Jobs / Journal / Analytics / My Life / AI Assistant / Settings** — interactive
- **Career / Freelancing / Learning / Goals / Calendar / Resources** — rich, styled views
- Global **⌘K command palette** (search + quick actions), floating nav, mobile bottom nav,
  gamified XP/level/streak, dark & light themes.

## Architecture

```
app/(dashboard)/        # route group: shell layout + every page
components/
  layout/               # sidebar, topbar, command palette, animated background, mobile nav
  ui/                   # GlassCard, StatCard, ProgressRing, Button, Badge, etc.
  dashboard/            # home widgets
  charts/               # Recharts wrappers
lib/
  store.ts              # Zustand store (persisted)
  data/seed.ts          # realistic demo dataset
  utils.ts, hooks.ts, nav.ts, types.ts, icon-map.ts
```

## v2 roadmap (not built yet)

Real auth (Google/GitHub), Postgres + Prisma persistence, live AI assistant, cloud file
uploads, live integrations (weather/GitHub/LeetCode/Spotify), FullCalendar, PWA/offline,
deployment. The architecture is modular so each can be added without rework.

> Data is demo/seed data stored locally in your browser. Reset it any time from **Settings → Data**.
