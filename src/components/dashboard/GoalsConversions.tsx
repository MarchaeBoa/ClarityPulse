"use client";

import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { Target, ArrowUpRight } from "lucide-react";

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-28 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-40 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-28 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
              <div className="w-16 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            </div>
            <div className="w-full h-1.5 rounded-full bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyGoals() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 flex flex-col items-center justify-center min-h-[300px]">
      <Target className="w-10 h-10 text-ghost/20 mb-3" />
      <p className="text-sm font-medium text-ghost/60">No goals configured</p>
      <p className="text-xs text-ghost/40 mt-1">Set up goals to track conversions</p>
    </div>
  );
}

export function GoalsConversions() {
  const { data, loading } = useDashboard();

  if (loading) return <CardSkeleton />;
  if (!data || data.goals.length === 0) return <EmptyGoals />;

  const kpis = data.kpis;

  // Conversion funnel from KPIs
  const funnelSteps = [
    { label: "Visitors", value: kpis.uniqueVisitors },
    { label: "Pageviews", value: kpis.pageviews },
    { label: "Conversions", value: kpis.conversions },
  ].filter((s) => s.value > 0);

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
        {data.goals.map((goal) => {
          const pct = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
          return (
            <div key={goal.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-ink dark:text-white">{goal.name}</span>
                <span className="text-[11px] text-ghost tabular-nums">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-mist dark:bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    pct >= 80 ? "bg-jade" : pct >= 50 ? "bg-gold" : "bg-sapphire"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini funnel */}
      {funnelSteps.length > 1 && (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ghost/50 mb-3">
            Conversion funnel
          </p>
          <div className="flex items-end gap-2">
            {funnelSteps.map((step, i) => {
              const height = 20 + (80 * step.value) / (funnelSteps[0]?.value || 1);
              const pct =
                funnelSteps[0].value > 0
                  ? Math.round((step.value / funnelSteps[0].value) * 1000) / 10
                  : 0;
              return (
                <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-ink dark:text-white tabular-nums">
                    {step.value >= 1000
                      ? `${(step.value / 1000).toFixed(1)}k`
                      : step.value}
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
                    <p className="text-[10px] font-medium text-ghost/60 tabular-nums">
                      {pct}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
