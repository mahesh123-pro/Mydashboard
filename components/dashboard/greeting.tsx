"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useNow } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { useWeather } from "@/lib/weather";
import { greeting, levelFromXp } from "@/lib/utils";
import { quoteOfDay } from "@/lib/data/seed";

export function Greeting() {
  const now = useNow(1000);
  const profile = useStore((s) => s.profile);
  const { level } = levelFromXp(profile.xp);
  const q = quoteOfDay(now ?? new Date());
  const weather = useWeather();

  const time = now
    ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "--:--";
  const date = now
    ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  return (
    <div className="glass relative overflow-hidden rounded-panel p-6 sm:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(circle, #10b981, transparent 65%)" }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="eyebrow"
          >
            {date}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display mt-2.5 text-display-md sm:text-display-lg"
          >
            {greeting(now ?? new Date())}, <span className="aurora-text italic">{profile.name}</span>
          </motion.h1>

          {/* refined stat rail — one accent (streak), the rest quiet */}
          <div className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-tile border border-border bg-surface px-4 py-2.5 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="size-4 text-warning" />
              <span className="font-semibold text-foreground tabular">{profile.streak}</span> day streak
            </span>
            <Divider />
            <span>
              Level <span className="font-semibold text-foreground tabular">{level}</span>
            </span>
            <Divider />
            <span>
              <span className="font-semibold text-foreground tabular">{profile.xp.toLocaleString("en-IN")}</span> XP
            </span>
          </div>
        </div>

        {/* clock + weather */}
        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="text-right">
            <div className="eyebrow mb-1">Local time</div>
            <div className="tabular text-4xl font-semibold tracking-tight sm:text-display-lg">{time}</div>
          </div>
          <div className="flex items-center gap-2.5 rounded-tile border border-border bg-surface px-3.5 py-2">
            <weather.Icon className={`size-5 ${weather.isDay ? "text-warning" : "text-secondary"}`} />
            <div className="leading-tight">
              <div className="tabular text-lg font-semibold">
                {weather.loading ? "—" : weather.error ? "N/A" : `${weather.tempC}°C`}
              </div>
              <div className="text-2xs text-muted-2">
                {weather.error ? "Weather unavailable" : `${weather.city} · ${weather.condition}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* quote — editorial serif */}
      <figure className="relative mt-7 border-l-2 border-primary/40 pl-4">
        <blockquote className="font-display text-sm italic leading-relaxed text-muted sm:text-base">
          “{q.text}”
        </blockquote>
        <figcaption className="mt-1 text-xs text-muted-2">— {q.author}</figcaption>
      </figure>
    </div>
  );
}

function Divider() {
  return <span className="h-3.5 w-px bg-border-strong" aria-hidden />;
}
