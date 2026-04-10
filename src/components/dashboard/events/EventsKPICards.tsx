"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  MousePointerClick,
  Target,
  Percent,
  DollarSign,
  Clock,
  Flame,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface EventKPI {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  sparkline: number[];
  color: string;
  tintColor: string;
  invertTrend?: boolean;
}

const kpis: EventKPI[] = [
  {
    label: "Total Events",
    value: "48,392",
    change: 14.2,
    icon: MousePointerClick,
    sparkline: [35, 42, 38, 52, 48, 58, 64, 60, 72, 68, 78, 82, 90, 95],
    color: "#3B7BF8",
    tintColor: "bg-sapphire/[0.08]",
  },
  {
    label: "Conversions",
    value: "1,284",
    change: 22.4,
    icon: Target,
    sparkline: [15, 20, 18, 25, 30, 28, 35, 40, 38, 45, 50, 48, 55, 60],
    color: "#1AE5A0",
    tintColor: "bg-jade/[0.08]",
  },
  {
    label: "Conversion Rate",
    value: "2.65%",
    change: 0.8,
    icon: Percent,
    sparkline: [40, 42, 41, 44, 43, 46, 45, 48, 47, 50, 49, 52, 51, 53],
    color: "#1AE5A0",
    tintColor: "bg-jade/[0.08]",
  },
  {
    label: "Revenue",
    value: "$12,480",
    change: 18.7,
    icon: DollarSign,
    sparkline: [25, 30, 28, 35, 40, 38, 45, 42, 50, 55, 52, 60, 58, 65],
    color: "#3B7BF8",
    tintColor: "bg-sapphire/[0.08]",
  },
  {
    label: "Avg. Time to Convert",
    value: "4m 22s",
    change: -12.3,
    icon: Clock,
    sparkline: [70, 65, 68, 60, 58, 55, 52, 50, 48, 46, 44, 42, 40, 38],
    color: "#F0A500",
    tintColor: "bg-gold/[0.08]",
    invertTrend: true,
  },
  {
    label: "Top Event",
    value: "CTA Click",
    change: 8421,
    icon: Flame,
    sparkline: [50, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80, 78, 85],
    color: "#F5653A",
    tintColor: "bg-ember/[0.08]",
  },
];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ v, i }));
  const gradId = `ev-spark-${color.replace("#", "")}`;

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EventsKPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {kpis.map((kpi, i) => {
        const isTopEvent = kpi.label === "Top Event";
        const isPositive = kpi.change > 0;
        const trendIsGood = kpi.invertTrend ? !isPositive : isPositive;

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
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", kpi.tintColor)}>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <MiniSparkline data={kpi.sparkline} color={kpi.color} />
            </div>

            <p className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white mb-1">
              {kpi.value}
            </p>

            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] text-ghost truncate">{kpi.label}</p>
              {isTopEvent ? (
                <span className="text-[11px] font-semibold text-ghost tabular-nums flex-shrink-0">
                  {kpi.change.toLocaleString()}
                </span>
              ) : (
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
