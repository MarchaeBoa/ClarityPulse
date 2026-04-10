"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Zap,
  AlertCircle,
  Filter,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { generateNaturalInsights, type NaturalInsight } from "@/lib/pulse-ai/insights-engine";

const typeConfig: Record<NaturalInsight["type"], { icon: React.ElementType; color: string; bg: string }> = {
  trend_up: { icon: TrendingUp, color: "text-jade", bg: "bg-jade/[0.08]" },
  trend_down: { icon: TrendingDown, color: "text-ember", bg: "bg-ember/[0.08]" },
  alert: { icon: AlertTriangle, color: "text-ember", bg: "bg-ember/[0.08]" },
  opportunity: { icon: Lightbulb, color: "text-gold", bg: "bg-gold/[0.08]" },
  achievement: { icon: Zap, color: "text-jade", bg: "bg-jade/[0.08]" },
  warning: { icon: AlertCircle, color: "text-gold", bg: "bg-gold/[0.08]" },
};

const severityColors: Record<NaturalInsight["severity"], string> = {
  critical: "bg-ember/10 text-ember border-ember/20",
  high: "bg-gold/10 text-gold border-gold/20",
  medium: "bg-sapphire/10 text-sapphire border-sapphire/20",
  low: "bg-ghost/10 text-ghost border-ghost/20",
};

type FilterCategory = "all" | NaturalInsight["category"];

export default function InsightsPage() {
  const insights = generateNaturalInsights();
  const [filter, setFilter] = useState<FilterCategory>("all");

  const filtered = filter === "all" ? insights : insights.filter((i) => i.category === filter);

  const categories: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "traffic", label: "Tráfego" },
    { value: "conversion", label: "Conversão" },
    { value: "engagement", label: "Engajamento" },
    { value: "content", label: "Conteúdo" },
    { value: "campaign", label: "Campanhas" },
    { value: "audience", label: "Audiência" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-jade" />
            Pulse AI Insights
          </h1>
          <p className="text-sm text-ghost mt-1">
            Análises inteligentes em linguagem natural sobre seus dados.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-ghost" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={cn(
                "px-2.5 py-1 rounded-full font-medium transition-colors",
                filter === cat.value
                  ? "bg-jade/10 text-jade"
                  : "text-ghost hover:text-ink dark:hover:text-white hover:bg-mist dark:hover:bg-white/[0.04]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary banner */}
      <div className="rounded-xl border bg-gradient-to-r from-jade/5 to-sapphire/5 dark:from-jade/[0.03] dark:to-sapphire/[0.03] border-jade/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-jade" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink dark:text-white">
              {insights.filter((i) => i.severity === "critical" || i.severity === "high").length} insights importantes detectados
            </p>
            <p className="text-xs text-ghost mt-0.5">
              {insights.filter((i) => i.actionable).length} são acionáveis e incluem sugestões de melhoria.
            </p>
          </div>
        </div>
      </div>

      {/* Insights grid */}
      <div className="space-y-3">
        {filtered.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className={cn(
                "rounded-xl border p-5 transition-all duration-200",
                "bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04]",
                "hover:border-black/[0.08] dark:hover:border-white/[0.08]",
                "hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-sm font-bold text-ink dark:text-white">
                      {insight.title}
                    </h3>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", severityColors[insight.severity])}>
                      {insight.severity === "critical" ? "Crítico" : insight.severity === "high" ? "Importante" : insight.severity === "medium" ? "Médio" : "Info"}
                    </span>
                    <span className="text-[10px] text-ghost bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {insight.category}
                    </span>
                  </div>

                  <p className="text-[13px] text-ghost leading-relaxed mb-3">
                    {insight.message}
                  </p>

                  {insight.suggestion && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-jade/[0.04] dark:bg-jade/[0.02] border border-jade/10">
                      <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[11px] font-semibold text-jade mb-0.5">Sugestão</p>
                        <p className="text-xs text-ghost">{insight.suggestion}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-[11px] text-ghost">
                    <span>{insight.metric}: <strong className="text-ink dark:text-white">{insight.value}</strong></span>
                    <span className={cn(
                      "font-semibold",
                      insight.change > 0 ? "text-jade" : "text-ember"
                    )}>
                      {insight.change > 0 ? "+" : ""}{insight.change}%
                    </span>
                    <span>{new Date(insight.timestamp).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
