"use client";

import { cn } from "@/lib/utils";
import { ArrowDown, TrendingDown } from "lucide-react";

interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

const funnelSteps: FunnelStep[] = [
  { label: "Visitors", value: 24521, color: "#3B7BF8" },
  { label: "Engaged", value: 14712, color: "#3B7BF8" },
  { label: "Clicked CTA", value: 8421, color: "#F0A500" },
  { label: "Signed Up", value: 842, color: "#1AE5A0" },
  { label: "Converted", value: 234, color: "#1AE5A0" },
];

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function ConversionFunnel() {
  const maxValue = funnelSteps[0].value;

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Conversion Funnel</h3>
        <p className="text-xs text-ghost mt-0.5">User journey from visit to conversion</p>
      </div>

      <div className="space-y-1">
        {funnelSteps.map((step, i) => {
          const widthPct = Math.max(12, (step.value / maxValue) * 100);
          const prevValue = i > 0 ? funnelSteps[i - 1].value : null;
          const dropOff = prevValue
            ? ((1 - step.value / prevValue) * 100).toFixed(1)
            : null;
          const overallPct = ((step.value / maxValue) * 100).toFixed(1);

          return (
            <div key={step.label}>
              {/* Drop-off indicator */}
              {dropOff && (
                <div className="flex items-center gap-2 py-1.5 pl-4">
                  <ArrowDown className="w-3 h-3 text-ghost/40" />
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="w-3 h-3 text-ember/60" />
                    <span className="text-[10px] text-ember/80 font-medium tabular-nums">
                      -{dropOff}% drop-off
                    </span>
                    <span className="text-[10px] text-ghost/40">
                      ({formatNum(funnelSteps[i - 1].value - step.value)} lost)
                    </span>
                  </div>
                </div>
              )}

              {/* Funnel bar */}
              <div className="flex items-center gap-3 group">
                <div className="w-[72px] flex-shrink-0 text-right">
                  <span className="text-xs font-medium text-ink dark:text-white">
                    {step.label}
                  </span>
                </div>

                <div className="flex-1 relative">
                  <div className="h-9 w-full rounded-lg bg-mist/50 dark:bg-white/[0.02] overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-lg transition-all duration-700 flex items-center px-3 group-hover:brightness-110"
                      )}
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: step.color,
                        opacity: 0.85 - i * 0.08,
                      }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow-sm whitespace-nowrap">
                        {formatNum(step.value)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-12 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-ghost tabular-nums">
                    {overallPct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall conversion */}
      <div className="mt-5 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center justify-between">
        <span className="text-xs text-ghost">Overall Conversion</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-display font-bold text-jade tracking-tight">
            {((funnelSteps[funnelSteps.length - 1].value / maxValue) * 100).toFixed(2)}%
          </span>
          <span className="text-[11px] text-ghost">
            ({formatNum(maxValue)} → {formatNum(funnelSteps[funnelSteps.length - 1].value)})
          </span>
        </div>
      </div>
    </div>
  );
}
