"use client";

import { cn } from "@/lib/utils";
import { Target, TrendingUp, ArrowUpRight } from "lucide-react";

interface Goal {
  name: string;
  current: number;
  target: number;
  change: number;
}

const goals: Goal[] = [
  { name: "Monthly Signups", current: 842, target: 1000, change: 18.2 },
  { name: "Trial to Paid", current: 234, target: 300, change: 22.5 },
  { name: "Revenue Target", current: 12480, target: 15000, change: 15.8 },
  { name: "Active Users", current: 4250, target: 5000, change: 8.4 },
];

const funnelSteps = [
  { label: "Visitors", value: 24521, pct: 100 },
  { label: "Engaged", value: 14712, pct: 60 },
  { label: "Signups", value: 842, pct: 3.4 },
  { label: "Paid", value: 234, pct: 0.95 },
];

export function GoalsConversions() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Goals & Conversions</h3>
          <p className="text-xs text-ghost mt-0.5">Progress toward your targets</p>
        </div>
        <button className="text-xs text-jade hover:text-jade-hover font-medium flex items-center gap-1 transition-colors">
          Manage <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Goals */}
      <div className="space-y-3.5 mb-6">
        {goals.map((goal) => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          const isRevenue = goal.name.includes("Revenue");
          const display = isRevenue
            ? `$${(goal.current / 1000).toFixed(1)}k / $${(goal.target / 1000).toFixed(0)}k`
            : `${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}`;

          return (
            <div key={goal.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-ink dark:text-white">{goal.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ghost tabular-nums">{display}</span>
                  <span className="text-[11px] font-semibold text-jade flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {goal.change}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-mist dark:bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    pct >= 80
                      ? "bg-jade"
                      : pct >= 50
                        ? "bg-gold"
                        : "bg-sapphire"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini funnel */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-ghost/50 mb-3">
          Conversion funnel
        </p>
        <div className="flex items-end gap-2">
          {funnelSteps.map((step, i) => {
            const height = 20 + (80 * step.value) / funnelSteps[0].value;
            return (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-semibold text-ink dark:text-white tabular-nums">
                  {step.value >= 1000 ? `${(step.value / 1000).toFixed(1)}k` : step.value}
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all",
                    i === 0
                      ? "bg-sapphire/30"
                      : i === funnelSteps.length - 1
                        ? "bg-jade"
                        : "bg-jade/30"
                  )}
                  style={{ height: `${height}px` }}
                />
                <div className="text-center">
                  <p className="text-[10px] text-ghost leading-tight">{step.label}</p>
                  <p className="text-[10px] font-medium text-ghost/60 tabular-nums">{step.pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
