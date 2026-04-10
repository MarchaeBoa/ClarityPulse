"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { comparePeriods, type ComparisonPeriod } from "@/lib/pulse-ai/period-comparison";

export default function ComparisonPage() {
  const [period, setPeriod] = useState<ComparisonPeriod>("30d");
  const comparison = comparePeriods(period);

  const formatMetricValue = (val: number, unit: string): string => {
    if (unit === "$") return `$${val.toLocaleString()}`;
    if (unit === "%") return `${val}%`;
    if (unit === "s") return `${Math.floor(val / 60)}m ${val % 60}s`;
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-gold" />
            Comparação de Períodos
          </h1>
          <p className="text-sm text-ghost mt-1">
            Compare períodos com explicação automática das diferenças.
          </p>
        </div>

        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as ComparisonPeriod)}
            className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-surface text-sm text-ink dark:text-white cursor-pointer"
          >
            <option value="7d">7 dias vs 7 dias anteriores</option>
            <option value="30d">30 dias vs 30 dias anteriores</option>
            <option value="90d">90 dias vs 90 dias anteriores</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost pointer-events-none" />
        </div>
      </div>

      {/* Period labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sapphire/[0.08] flex items-center justify-center">
            <span className="text-xs font-bold text-sapphire">A</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink dark:text-white">{comparison.previous.label}</p>
            <p className="text-[10px] text-ghost">{comparison.previous.startDate} — {comparison.previous.endDate}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-jade/[0.08] flex items-center justify-center">
            <span className="text-xs font-bold text-jade">B</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink dark:text-white">{comparison.current.label}</p>
            <p className="text-[10px] text-ghost">{comparison.current.startDate} — {comparison.current.endDate}</p>
          </div>
        </div>
      </div>

      {/* Metrics comparison grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {comparison.metrics.slice(0, 10).map((metric, i) => {
          const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus;
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4"
            >
              <p className="text-[10px] text-ghost mb-2">{metric.label}</p>
              <div className="flex items-center gap-1 mb-1">
                <p className="text-xs text-ghost line-through">{formatMetricValue(metric.previous, metric.unit)}</p>
                <ArrowRight className="w-3 h-3 text-ghost" />
                <p className="text-sm font-bold text-ink dark:text-white">{formatMetricValue(metric.current, metric.unit)}</p>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[11px] font-semibold",
                metric.isPositive ? "text-jade" : metric.trend === "stable" ? "text-ghost" : "text-ember"
              )}>
                <TrendIcon className="w-3 h-3" />
                {metric.changePercent > 0 ? "+" : ""}{metric.changePercent}%
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Explanation */}
      <div className="rounded-xl border bg-gradient-to-r from-jade/[0.03] to-sapphire/[0.03] border-jade/10 dark:border-jade/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-jade/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-jade" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-white">Análise Automática</h3>
            <p className="text-[10px] text-ghost">Gerada pela Pulse AI</p>
          </div>
        </div>
        <div className="text-[13px] text-ghost leading-relaxed prose-strong:text-ink dark:prose-strong:text-white"
          dangerouslySetInnerHTML={{
            __html: comparison.explanation
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }}
        />
      </div>

      {/* Highlights */}
      <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Principais Mudanças</h3>
        <div className="space-y-3">
          {comparison.highlights.map((highlight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                highlight.type === "positive" ? "bg-jade/[0.04]" : "bg-ember/[0.04]"
              )}
            >
              {highlight.type === "positive" ? (
                <TrendingUp className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 text-ember mt-0.5 flex-shrink-0" />
              )}
              <span
                className="text-xs text-ghost leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-ink dark:text-white">$1</strong>')
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top changes with explanations */}
      <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Explicação das Variações</h3>
        <div className="space-y-4">
          {comparison.topChanges.map((change, i) => (
            <motion.div
              key={change.metric}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="pb-4 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs font-bold text-ink dark:text-white">{change.metric}</span>
                <span className="text-[10px] text-ghost">{change.from}</span>
                <ArrowRight className="w-3 h-3 text-ghost" />
                <span className="text-[10px] font-bold text-ink dark:text-white">{change.to}</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  change.changePercent > 0 ? "text-jade" : "text-ember"
                )}>
                  {change.changePercent > 0 ? "+" : ""}{change.changePercent}%
                </span>
              </div>
              <p className="text-xs text-ghost leading-relaxed">{change.explanation}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
