"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
} from "recharts";

const axisStyle = {
  fontSize: 11,
  fill: "var(--muted-2)",
};

function ChartTooltip({ active, payload, label, valuePrefix = "", valueSuffix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs shadow-xl">
      {label !== undefined && <div className="mb-1 font-medium text-muted">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 tabular">
          <span className="size-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-foreground font-semibold">
            {valuePrefix}
            {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
            {valueSuffix}
          </span>
          {p.name && <span className="text-muted-2">{p.name}</span>}
        </div>
      ))}
    </div>
  );
}

export function AreaTrend({
  data,
  dataKey = "value",
  xKey = "date",
  from = "#10b981",
  to = "#14b8a6",
  height = 220,
  prefix = "",
  suffix = "",
}: {
  data: any[];
  dataKey?: string;
  xKey?: string;
  from?: string;
  to?: string;
  height?: number;
  prefix?: string;
  suffix?: string;
}) {
  const id = dataKey + from.replace("#", "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={from} stopOpacity={0.5} />
            <stop offset="100%" stopColor={to} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={20} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={44} />
        <Tooltip content={<ChartTooltip valuePrefix={prefix} valueSuffix={suffix} />} cursor={{ stroke: "var(--border-strong)" }} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={from}
          strokeWidth={2.5}
          fill={`url(#area-${id})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: from }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarTrend({
  data,
  dataKey = "value",
  xKey = "label",
  color = "#059669",
  height = 220,
  suffix = "",
}: {
  data: any[];
  dataKey?: string;
  xKey?: string;
  color?: string;
  height?: number;
  suffix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={`bar-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
            <stop offset="100%" stopColor={color} stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={44} />
        <Tooltip content={<ChartTooltip valueSuffix={suffix} />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey={dataKey} fill={`url(#bar-${color.replace("#", "")})`} radius={[6, 6, 0, 0]} maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({
  data,
  height = 220,
  inner = 58,
  outer = 84,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  inner?: number;
  outer?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip content={<ChartTooltip valuePrefix="₹" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={inner}
          outerRadius={outer}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadialGauge({
  value,
  color = "#10b981",
  height = 180,
  label,
}: {
  value: number;
  color?: string;
  height?: number;
  label?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        innerRadius="70%"
        outerRadius="100%"
        data={[{ value }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" cornerRadius={20} fill={color} background={{ fill: "rgba(255,255,255,0.06)" }} />
        <text x="50%" y="47%" textAnchor="middle" className="fill-foreground" style={{ fontSize: 22, fontWeight: 700 }}>
          {value}%
        </text>
        {label && (
          <text x="50%" y="62%" textAnchor="middle" className="fill-current" style={{ fontSize: 11, fill: "var(--muted-2)" }}>
            {label}
          </text>
        )}
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({
  data,
  color = "#10b981",
  height = 44,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={d} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#spark-${color.replace("#", "")})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
