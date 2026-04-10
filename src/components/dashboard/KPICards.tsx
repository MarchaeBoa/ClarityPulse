"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users,
  Eye,
  ArrowDownRight,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

interface KPI {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  sparkline: number[];
  color: string;
  tintColor: string;
}

const kpis: KPI[] = [
  {
    label: "Unique Visitors",
    value: "24,521",
    change: 12.5,
    icon: Users,
    sparkline: [30, 40, 35, 50, 49, 60, 70, 65, 80, 75, 90, 85, 95, 100],
    color: "#1AE5A0",
    tintColor: "bg-jade/[0.08]",
  },
  {
    label: "Pageviews",
    value: "68,342",
    change: 8.3,
    icon: Eye,
    sparkline: [40, 45, 42, 55, 52, 58, 65, 60, 70, 68, 75, 72, 80, 78],
    color: "#3B7BF8",
    tintColor: "bg-sapphire/[0.08]",
  },
  {
    label: "Bounce Rate",
    value: "42.3%",
    change: -3.2,
    icon: ArrowDownRight,
    sparkline: [60, 55, 58, 52, 50, 48, 46, 45, 44, 42, 43, 41, 42, 40],
    color: "#F5653A",
    tintColor: "bg-ember/[0.08]",
  },
  {
    label: "Avg. Duration",
    value: "3m 42s",
    change: 15.1,
    icon: Clock,
    sparkline: [20, 25, 28, 30, 35, 33, 40, 38, 45, 42, 50, 48, 55, 52],
    color: "#F0A500",
    tintColor: "bg-gold/[0.08]",
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
    label: "Revenue",
    value: "$12,480",
    change: 18.7,
    icon: DollarSign,
    sparkline: [25, 30, 28, 35, 40, 38, 45, 42, 50, 55, 52, 60, 58, 65],
    color: "#3B7BF8",
    tintColor: "bg-sapphire/[0.08]",
  },
];

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

export function KPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {kpis.map((kpi, i) => {
        const isPositive = kpi.change > 0;
        const isBounceRate = kpi.label === "Bounce Rate";
        const trendIsGood = isBounceRate ? !isPositive : isPositive;

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
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
