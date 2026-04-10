"use client";

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

interface EventPerformanceChartProps {
  period: "7D" | "30D" | "90D";
}

function generateEventData(days: number) {
  const data = [];
  const baseEvents = [
    1420, 1580, 1380, 1720, 1840, 1280, 1120,
    1520, 1660, 1780, 1920, 1980, 1340, 1200,
    1600, 1740, 1860, 2020, 2100, 1400, 1280,
    1700, 1880, 1980, 2120, 2220, 1480, 1360,
    1840, 2040,
  ];
  for (let i = 0; i < days; i++) {
    const idx = i % baseEvents.length;
    const events = baseEvents[idx] + Math.floor((i / days) * 300);
    const conversions = Math.floor(events * (0.022 + Math.random() * 0.012));
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      events,
      conversions,
    });
  }
  return data;
}

const datasets: Record<string, ReturnType<typeof generateEventData>> = {
  "7D": generateEventData(7),
  "30D": generateEventData(30),
  "90D": generateEventData(90),
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

export function EventPerformanceChart({ period }: EventPerformanceChartProps) {
  const data = datasets[period];

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Event Performance</h3>
          <p className="text-xs text-ghost mt-0.5">Events & conversions over time</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sapphire" />
          <span className="text-xs text-ghost">Events</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-jade" />
          <span className="text-xs text-ghost">Conversions</span>
        </div>
      </div>

      <div className="h-[280px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B7BF8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B7BF8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1AE5A0" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1AE5A0" stopOpacity={0} />
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
              dataKey="events"
              stroke="#3B7BF8"
              strokeWidth={2}
              fill="url(#gradEvents)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#3B7BF8" }}
            />
            <Area
              type="monotone"
              dataKey="conversions"
              stroke="#1AE5A0"
              strokeWidth={2}
              fill="url(#gradConversions)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#1AE5A0" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
