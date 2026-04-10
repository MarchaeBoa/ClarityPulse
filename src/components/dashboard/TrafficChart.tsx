"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const periods = ["7D", "30D", "90D"] as const;

function generateData(days: number) {
  const data = [];
  const base30 = [
    820, 940, 880, 1020, 1080, 760, 680,
    900, 960, 1040, 1120, 1160, 800, 720,
    950, 1020, 1080, 1180, 1220, 840, 760,
    1000, 1100, 1160, 1240, 1300, 880, 800,
    1080, 1200,
  ];
  for (let i = 0; i < days; i++) {
    const idx = i % base30.length;
    const visitors = base30[idx] + Math.floor((i / days) * 200);
    const pageviews = Math.floor(visitors * 2.5);
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visitors,
      pageviews,
    });
  }
  return data;
}

const datasets: Record<string, ReturnType<typeof generateData>> = {
  "7D": generateData(7),
  "30D": generateData(30),
  "90D": generateData(90),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-ink-2 border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3 py-2.5 shadow-lg text-sm">
      <p className="text-ghost text-xs mb-1.5">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-ghost text-xs capitalize">{entry.dataKey}:</span>
          <span className="font-semibold text-ink dark:text-white text-xs">
            {entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrafficChart() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30D");
  const data = datasets[period];

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Traffic Overview</h3>
          <p className="text-xs text-ghost mt-0.5">Visitors & pageviews over time</p>
        </div>
        <div className="flex items-center bg-mist dark:bg-white/[0.04] rounded-lg p-0.5">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                period === p
                  ? "bg-white dark:bg-white/[0.08] text-ink dark:text-white shadow-sm"
                  : "text-ghost hover:text-ink dark:hover:text-white"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-jade" />
          <span className="text-xs text-ghost">Visitors</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sapphire" />
          <span className="text-xs text-ghost">Pageviews</span>
        </div>
      </div>

      <div className="h-[280px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1AE5A0" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1AE5A0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B7BF8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B7BF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-black/[0.04] dark:text-white/[0.04]"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9BA0AE" }}
              interval={period === "7D" ? 0 : period === "30D" ? 4 : 14}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9BA0AE" }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#1AE5A0"
              strokeWidth={2}
              fill="url(#gradVisitors)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#1AE5A0" }}
            />
            <Area
              type="monotone"
              dataKey="pageviews"
              stroke="#3B7BF8"
              strokeWidth={2}
              fill="url(#gradPageviews)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#3B7BF8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
