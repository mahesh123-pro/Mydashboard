"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="panel flex flex-col items-center rounded-panel p-6">
      <div className="flex items-center gap-2 self-start text-sm font-semibold text-muted">
        <Timer className="size-4 text-danger" /> Workout Timer
      </div>
      <div className={cn("tabular my-5 text-5xl font-bold tracking-tight", running && "text-danger")}>
        {mm}:{ss}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex h-11 items-center gap-2 rounded-field bg-gradient-to-br from-primary to-secondary px-5 text-sm font-medium text-white cursor-pointer"
        >
          {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(0);
          }}
          className="grid size-11 place-items-center rounded-field border border-border-strong text-muted transition-colors hover:text-foreground cursor-pointer"
        >
          <RotateCcw className="size-4" />
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        {[30, 60, 90].map((s) => (
          <button
            key={s}
            onClick={() => {
              setSeconds(s);
              setRunning(true);
            }}
            className="rounded-control border border-border bg-surface px-2.5 py-1 text-2xs text-muted-2 transition-colors hover:text-foreground cursor-pointer"
          >
            {s}s rest
          </button>
        ))}
      </div>
    </div>
  );
}
