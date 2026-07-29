"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 550,
  className,
  format,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    // Safety net: timers still fire when rAF is paused (background/hidden tab),
    // guaranteeing the final value is shown instead of sticking at the start.
    const settle = setTimeout(() => {
      setDisplay(value);
      fromRef.current = value;
    }, duration + 80);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [value, duration]);

  const text = format
    ? format(display)
    : `${prefix}${display.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

  return <span className={cn("tabular", className)}>{text}</span>;
}
