"use client";

import { useMemo, useState } from "react";
import { dayKey } from "@/lib/utils";

/** GitHub-style contribution heatmap of overall habit completion. */
export function HabitHeatmap({
  habitLog,
  habitIds,
  weeks = 20,
}: {
  habitLog: Record<string, Record<string, boolean>>;
  habitIds: string[];
  weeks?: number;
}) {
  const [hover, setHover] = useState<{ date: string; count: number; total: number } | null>(null);

  const cells = useMemo(() => {
    const total = habitIds.length;
    const days: { date: string; count: number; level: number }[] = [];
    // align to weeks*7 days ending today
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));
    // shift start back to Sunday
    start.setDate(start.getDate() - start.getDay());

    const cursor = new Date(start);
    while (cursor <= end) {
      const key = dayKey(cursor);
      const count = habitIds.filter((id) => habitLog[id]?.[key]).length;
      const ratio = total ? count / total : 0;
      const level = count === 0 ? 0 : ratio < 0.34 ? 1 : ratio < 0.67 ? 2 : ratio < 1 ? 3 : 4;
      days.push({ date: key, count, level });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [habitLog, habitIds, weeks]);

  const columns: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) columns.push(cells.slice(i, i + 7));

  const colors = [
    "rgba(255,255,255,0.05)",
    "rgba(99,102,241,0.35)",
    "rgba(99,102,241,0.6)",
    "rgba(139,92,246,0.8)",
    "#22c55e",
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((cell) => (
              <div
                key={cell.date}
                onMouseEnter={() =>
                  setHover({ date: cell.date, count: cell.count, total: habitIds.length })
                }
                onMouseLeave={() => setHover(null)}
                className="size-3 rounded-[3px] transition-transform hover:scale-125"
                style={{ background: colors[cell.level] }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-2">
        <span>
          {hover
            ? `${new Date(hover.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${hover.count}/${hover.total} habits`
            : `${weeks} weeks`}
        </span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {colors.map((c, i) => (
            <span key={i} className="size-3 rounded-[3px]" style={{ background: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
