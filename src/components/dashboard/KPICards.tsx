"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Users,
  Eye,
  ArrowDownRight,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

function pctChange(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`.replace(".0k", "k");
  return n.toLocaleString();
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace("#", "")})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-8 h-8 rounded-lg bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="w-20 h-8 rounded-md bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
          <div className="w-24 h-7 mb-2 rounded-md bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="w-20 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="w-12 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyKPI() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4 flex flex-col items-center justify-center min-h-[120px]"
        >
          <BarChart3 className="w-5 h-5 text-ghost/30 mb-2" />
          <p className="text-xs text-ghost/50">No data</p>
        </div>
      ))}
    </div>
  );
}

export function KPICards() {
  const { data, loading } = useDashboard();

  if (loading) return <KPISkeleton />;
  if (!data) return <EmptyKPI />;

  const { kpis, dailyTraffic } = data;

  // Build sparkline from daily traffic
  const visitorsSparkline = dailyTraffic.map((d) => d.visitors);
  const pageviewsSparkline = dailyTraffic.map((d) => d.pageviews);
  // For other KPIs, generate approximate sparklines from daily data
  const emptySparkline = Array.from({ length: 14 }, () => 0);

  const items = [
    {
      label: "Unique Visitors",
      value: formatNumber(kpis.uniqueVisitors),
      change: pctChange(kpis.uniqueVisitors, kpis.prevUniqueVisitors),
      icon: Users,
      sparkline: visitorsSparkline.length > 1 ? visitorsSparkline : emptySparkline,
      color: "#1AE5A0",
      tintColor: "bg-jade/[0.08]",
    },
    {
      label: "Pageviews",
      value: formatNumber(kpis.pageviews),
      change: pctChange(kpis.pageviews, kpis.prevPageviews),
      icon: Eye,
      sparkline: pageviewsSparkline.length > 1 ? pageviewsSparkline : emptySparkline,
      color: "#3B7BF8",
      tintColor: "bg-sapphire/[0.08]",
    },
    {
      label: "Bounce Rate",
      value: `${kpis.bounceRate.toFixed(1)}%`,
      change: pctChange(kpis.bounceRate, kpis.prevBounceRate),
      icon: ArrowDownRight,
      sparkline: emptySparkline,
      color: "#F5653A",
      tintColor: "bg-ember/[0.08]",
    },
    {
      label: "Avg. Duration",
      value: formatDuration(kpis.avgDuration),
      change: pctChange(kpis.avgDuration, kpis.prevAvgDuration),
      icon: Clock,
      sparkline: emptySparkline,
      color: "#F0A500",
      tintColor: "bg-gold/[0.08]",
    },
    {
      label: "Conversions",
      value: formatNumber(kpis.conversions),
      change: pctChange(kpis.conversions, kpis.prevConversions),
      icon: Target,
      sparkline: emptySparkline,
      color: "#1AE5A0",
      tintColor: "bg-jade/[0.08]",
    },
    {
      label: "Revenue",
      value: `$${formatNumber(kpis.revenue)}`,
      change: pctChange(kpis.revenue, kpis.prevRevenue),
      icon: DollarSign,
      sparkline: emptySparkline,
      color: "#3B7BF8",
      tintColor: "bg-sapphire/[0.08]",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {items.map((kpi, i) => {
        const isPositive = kpi.change > 0;
        const isBounceRate = kpi.label === "Bounce Rate";
        const trendIsGood = isBounceRate ? !isPositive : isPositive;
        const hasSparkline = kpi.sparkline.some((v) => v > 0);

        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
              "group relative rounded-xl border p-4 transition-all duration-200",
              "bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04]",
              "hover:border-black/[0.08] dark:hover:border-white/[0.08]",
              "hover:shadow-md dark:hover:shadow-none"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  kpi.tintColor
                )}
              >
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              {hasSparkline && <MiniSparkline data={kpi.sparkline} color={kpi.color} />}
            </div>

            <p className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white mb-1">
              {kpi.value}
            </p>

            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] text-ghost truncate">{kpi.label}</p>
              {kpi.change !== 0 && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-[11px] font-semibold flex-shrink-0",
                    trendIsGood ? "text-jade" : "text-ember"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(kpi.change)}%
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
