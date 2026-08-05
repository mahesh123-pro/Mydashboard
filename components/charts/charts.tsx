"use client";

import dynamic from "next/dynamic";

/**
 * Lazy chart wrappers — Recharts is heavy, so it's split out of the initial
 * render and loaded client-side only, with a shimmer skeleton while it arrives.
 */
function Loading({ height = 220 }: { height?: number }) {
  return <div className="skeleton w-full rounded-field" style={{ height }} />;
}

export const AreaTrend = dynamic(() => import("./charts-impl").then((m) => m.AreaTrend), {
  ssr: false,
  loading: () => <Loading />,
});

export const BarTrend = dynamic(() => import("./charts-impl").then((m) => m.BarTrend), {
  ssr: false,
  loading: () => <Loading />,
});

export const Donut = dynamic(() => import("./charts-impl").then((m) => m.Donut), {
  ssr: false,
  loading: () => <Loading />,
});

export const RadialGauge = dynamic(() => import("./charts-impl").then((m) => m.RadialGauge), {
  ssr: false,
  loading: () => <Loading height={180} />,
});

export const Sparkline = dynamic(() => import("./charts-impl").then((m) => m.Sparkline), {
  ssr: false,
  loading: () => <Loading height={44} />,
});
