"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HeartPulse,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ArrowUpRight,
  Smartphone,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  Wrench,
} from "lucide-react";
import { detectProblematicPages, type ProblematicPage, type PageIssue } from "@/lib/pulse-ai/problematic-pages";

const severityConfig = {
  critical: { icon: AlertTriangle, color: "text-ember", bg: "bg-ember/[0.08]", border: "border-ember/20", label: "Crítico" },
  warning: { icon: AlertCircle, color: "text-gold", bg: "bg-gold/[0.08]", border: "border-gold/20", label: "Atenção" },
  info: { icon: Info, color: "text-sapphire", bg: "bg-sapphire/[0.08]", border: "border-sapphire/20", label: "Info" },
};

function HealthBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-jade" : score >= 50 ? "bg-gold" : "bg-ember";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-mist-2 dark:bg-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <span className={cn("text-xs font-bold tabular-nums", score >= 70 ? "text-jade" : score >= 50 ? "text-gold" : "text-ember")}>
        {score}
      </span>
    </div>
  );
}

export default function PageHealthPage() {
  const report = detectProblematicPages();
  const [expandedPage, setExpandedPage] = useState<string | null>(report.pages[0]?.path || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-ember" />
          Saúde das Páginas
        </h1>
        <p className="text-sm text-ghost mt-1">
          Detecção automática de páginas com problemas de performance.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
          <p className="text-[10px] text-ghost mb-1">Total de Problemas</p>
          <p className="text-xl font-display font-bold text-ink dark:text-white">{report.totalIssues}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
          <p className="text-[10px] text-ghost mb-1">Críticos</p>
          <p className="text-xl font-display font-bold text-ember">{report.criticalCount}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
          <p className="text-[10px] text-ghost mb-1">Páginas Afetadas</p>
          <p className="text-xl font-display font-bold text-ink dark:text-white">{report.pages.length}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
          <p className="text-[10px] text-ghost mb-1">Conversões Perdidas/mês</p>
          <p className="text-xl font-display font-bold text-ember">~{report.estimatedTotalLoss}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border bg-gradient-to-r from-ember/5 to-gold/5 dark:from-ember/[0.02] dark:to-gold/[0.02] border-ember/10 p-4">
        <p className="text-sm text-ink dark:text-white leading-relaxed">{report.summary}</p>
        <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-jade/[0.04] border border-jade/10">
          <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
          <p className="text-xs text-ghost">{report.topRecommendation}</p>
        </div>
      </div>

      {/* Page cards */}
      <div className="space-y-3">
        {report.pages.map((page, i) => {
          const isExpanded = expandedPage === page.path;

          return (
            <motion.div
              key={page.path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "rounded-xl border overflow-hidden",
                "bg-white dark:bg-surface",
                page.priority === "high" ? "border-ember/20" : "border-black/[0.04] dark:border-white/[0.04]"
              )}
            >
              {/* Page header */}
              <button
                onClick={() => setExpandedPage(isExpanded ? null : page.path)}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold",
                  page.score >= 70 ? "bg-jade/10 text-jade" :
                  page.score >= 50 ? "bg-gold/10 text-gold" :
                  "bg-ember/10 text-ember"
                )}>
                  {page.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-ink dark:text-white">{page.title}</h3>
                    <span className="text-[10px] text-ghost font-mono">{page.path}</span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                      page.priority === "high" ? "bg-ember/10 text-ember" :
                      page.priority === "medium" ? "bg-gold/10 text-gold" :
                      "bg-ghost/10 text-ghost"
                    )}>
                      {page.priority === "high" ? "Alta" : page.priority === "medium" ? "Média" : "Baixa"} prioridade
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-ghost">
                    <span>{page.issues.length} problema(s)</span>
                    <span>~{page.estimatedLostConversions} conv. perdidas/mês</span>
                    <span>Bounce: {page.metrics.bounceRate}%</span>
                    <span>Load: {page.metrics.loadTime}</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-ghost" /> : <ChevronDown className="w-4 h-4 text-ghost" />}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-5 border-t border-black/[0.04] dark:border-white/[0.04]">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-2 py-4">
                    {[
                      { label: "Views", value: page.metrics.views.toLocaleString() },
                      { label: "Bounce Rate", value: `${page.metrics.bounceRate}%` },
                      { label: "Tempo Médio", value: page.metrics.avgTime },
                      { label: "Load Time", value: page.metrics.loadTime },
                      { label: "Exit Rate", value: `${page.metrics.exitRate}%` },
                      { label: "Mobile Score", value: `${page.metrics.mobileScore}/100` },
                      { label: "Variação", value: `${page.metrics.change > 0 ? "+" : ""}${page.metrics.change}%` },
                    ].map((m) => (
                      <div key={m.label} className="p-2 rounded-lg bg-mist/30 dark:bg-white/[0.015] text-center">
                        <p className="text-[9px] text-ghost">{m.label}</p>
                        <p className="text-xs font-bold text-ink dark:text-white mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Health bar */}
                  <div className="mb-4">
                    <p className="text-[10px] text-ghost mb-1">Health Score</p>
                    <HealthBar score={page.score} />
                  </div>

                  {/* Issues */}
                  <div className="space-y-3">
                    {page.issues.map((issue, j) => {
                      const sev = severityConfig[issue.severity];
                      const SevIcon = sev.icon;

                      return (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.08 }}
                          className={cn("rounded-lg border p-4", sev.border, "bg-white dark:bg-surface")}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", sev.bg)}>
                              <SevIcon className={cn("w-4 h-4", sev.color)} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xs font-bold text-ink dark:text-white">{issue.title}</h4>
                                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", sev.bg, sev.color)}>
                                  {sev.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-ghost mb-2">{issue.description}</p>
                              <div className="text-[11px] text-ghost mb-2">
                                <strong className="text-ink dark:text-white">Impacto:</strong> {issue.impact}
                              </div>
                              <div className="flex items-start gap-2 p-2.5 rounded-md bg-jade/[0.04] border border-jade/10">
                                <Wrench className="w-3.5 h-3.5 text-jade mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-[10px] font-semibold text-jade">Como corrigir</p>
                                  <p className="text-[11px] text-ghost">{issue.fix}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
