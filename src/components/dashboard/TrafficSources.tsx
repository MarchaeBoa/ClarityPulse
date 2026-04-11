"use client";

import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Globe, Search, Share2, Link2, Mail, DollarSign, Layers } from "lucide-react";

const SOURCE_COLORS = [
  "#1AE5A0",
  "#3B7BF8",
  "#A855F7",
  "#F0A500",
  "#F5653A",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
];

const SOURCE_ICONS: Record<string, React.ElementType> = {
  Direct: Globe,
  "Organic Search": Search,
  Google: Search,
  Social: Share2,
  Referral: Link2,
  Email: Mail,
  Paid: DollarSign,
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`.replace(".0k", "k");
  return n.toLocaleString();
}

function SourcesSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="w-28 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
      <div className="w-40 h-3 mb-6 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
      <div className="w-[180px] h-[180px] rounded-full mx-auto mb-4 bg-mist dark:bg-white/[0.04] animate-pulse" />
      <div className="space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="flex-1 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="w-8 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptySources() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 h-full flex flex-col items-center justify-center">
      <Layers className="w-10 h-10 text-ghost/20 mb-3" />
      <p className="text-sm font-medium text-ghost/60">No source data</p>
      <p className="text-xs text-ghost/40 mt-1">Traffic sources will appear here</p>
    </div>
  );
}

export function TrafficSources() {
  const { data, loading } = useDashboard();

  if (loading) return <SourcesSkeleton />;
  if (!data || data.trafficSources.length === 0) return <EmptySources />;

  const sources = data.trafficSources.map((s, i) => ({
    ...s,
    color: SOURCE_COLORS[i % SOURCE_COLORS.length],
    icon: SOURCE_ICONS[s.source] ?? Globe,
  }));

  const totalVisitors = sources.reduce((s, src) => s + src.visitors, 0);

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Traffic Sources</h3>
        <p className="text-xs text-ghost mt-0.5">Where your visitors come from</p>
      </div>

      {/* Donut chart */}
      <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sources}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              dataKey="visitors"
              strokeWidth={0}
            >
              {sources.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-ink-2 border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs font-medium text-ink dark:text-white">
                      {d.source}
                    </p>
                    <p className="text-xs text-ghost">
                      {d.percentage}% &middot; {d.visitors.toLocaleString()} visitors
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-bold text-ink dark:text-white">
            {formatNumber(totalVisitors)}
          </span>
          <span className="text-[11px] text-ghost">total</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2 flex-1">
        {sources.map((s) => (
          <div key={s.source} className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-xs text-ghost flex-1 truncate">{s.source}</span>
            <span className="text-xs font-medium text-ink dark:text-white tabular-nums">
              {s.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
