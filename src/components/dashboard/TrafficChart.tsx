"use client";

import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="w-28 h-4 mb-2 rounded-md bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-40 h-3 rounded-md bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-5 mb-4">
        <div className="w-16 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        <div className="w-16 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
      </div>
      <div className="w-full h-[280px] rounded-lg bg-mist dark:bg-white/[0.04] animate-pulse" />
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Traffic Overview</h3>
        <p className="text-xs text-ghost mt-0.5">Visitors & pageviews over time</p>
      </div>
      <div className="h-[280px] flex flex-col items-center justify-center">
        <BarChart3 className="w-10 h-10 text-ghost/20 mb-3" />
        <p className="text-sm font-medium text-ghost/60">No traffic data yet</p>
        <p className="text-xs text-ghost/40 mt-1">Data will appear once visitors start arriving</p>
      </div>
    </div>
  );
}

export function TrafficChart() {
  const { data, loading, dateRange } = useDashboard();

  if (loading) return <ChartSkeleton />;
  if (!data || data.dailyTraffic.length === 0) return <EmptyChart />;

  const chartData = data.dailyTraffic.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    visitors: d.visitors,
    pageviews: d.pageviews,
  }));

  const days = chartData.length;
  const interval = days <= 7 ? 0 : days <= 30 ? 4 : 14;

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Traffic Overview</h3>
          <p className="text-xs text-ghost mt-0.5">Visitors & pageviews over time</p>
        </div>
        <div className="text-[11px] text-ghost bg-mist dark:bg-white/[0.04] px-2.5 py-1 rounded-lg font-medium">
          {dateRange === "today"
            ? "Today"
            : dateRange === "yesterday"
              ? "Yesterday"
              : dateRange === "7d"
                ? "Last 7 days"
                : dateRange === "30d"
                  ? "Last 30 days"
                  : dateRange === "90d"
                    ? "Last 90 days"
                    : dateRange === "month"
                      ? "This month"
                      : "This year"}
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
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
              interval={interval}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9BA0AE" }}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
              }
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
