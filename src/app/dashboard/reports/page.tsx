"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CalendarClock,
  Mail,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Trophy,
  AlertTriangle,
  FileText,
  Plus,
  Settings,
  Eye,
} from "lucide-react";
import {
  generateWeeklySummary,
  getDefaultSummaryConfigs,
  formatWhatsAppSummary,
  type WeeklySummary,
  type SummaryConfig,
} from "@/lib/pulse-ai/weekly-summary";

const trendColors = {
  up: "text-jade",
  down: "text-ember",
  stable: "text-ghost",
};

export default function ReportsPage() {
  const summary = generateWeeklySummary();
  const configs = getDefaultSummaryConfigs();
  const [tab, setTab] = useState<"preview" | "config">("preview");
  const [previewFormat, setPreviewFormat] = useState<"visual" | "whatsapp">("visual");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-sapphire" />
          Resumo Automático
        </h1>
        <p className="text-sm text-ghost mt-1">
          Relatórios semanais automáticos por email e WhatsApp.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-mist dark:bg-white/[0.04] w-fit">
        {[
          { id: "preview" as const, label: "Preview do Resumo" },
          { id: "config" as const, label: "Configurações" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
              tab === t.id
                ? "bg-white dark:bg-surface shadow-sm text-ink dark:text-white"
                : "text-ghost hover:text-ink dark:hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "preview" && (
        <div className="space-y-5">
          {/* Format toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewFormat("visual")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                previewFormat === "visual"
                  ? "bg-sapphire/10 text-sapphire"
                  : "text-ghost hover:bg-mist dark:hover:bg-white/[0.04]"
              )}
            >
              <Eye className="w-3.5 h-3.5" /> Visual
            </button>
            <button
              onClick={() => setPreviewFormat("whatsapp")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                previewFormat === "whatsapp"
                  ? "bg-jade/10 text-jade"
                  : "text-ghost hover:bg-mist dark:hover:bg-white/[0.04]"
              )}
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </button>
          </div>

          {previewFormat === "visual" ? (
            <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] overflow-hidden">
              {/* Summary header */}
              <div className="p-5 bg-gradient-to-r from-jade/5 to-sapphire/5 dark:from-jade/[0.03] dark:to-sapphire/[0.03] border-b border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-ghost">Resumo Semanal</p>
                    <h2 className="text-lg font-display font-bold text-ink dark:text-white">{summary.period}</h2>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "text-2xl font-display font-bold",
                        summary.overallScore >= 70 ? "text-jade" : summary.overallScore >= 50 ? "text-gold" : "text-ember"
                      )}>
                        {summary.overallScore}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-ghost">Score</p>
                        <p className="text-[10px] font-semibold text-ghost">/100</p>
                      </div>
                    </div>
                    <p className={cn(
                      "text-[10px] font-semibold mt-0.5",
                      summary.trend === "improving" ? "text-jade" : summary.trend === "stable" ? "text-gold" : "text-ember"
                    )}>
                      {summary.trend === "improving" ? "Melhorando" : summary.trend === "stable" ? "Estável" : "Atenção"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="p-5 border-b border-black/[0.04] dark:border-white/[0.04]">
                <h3 className="text-xs font-bold text-ink dark:text-white mb-3 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-gold" /> Destaques da Semana
                </h3>
                <div className="space-y-2">
                  {summary.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={cn(
                        "flex items-start gap-2 p-2.5 rounded-lg text-xs",
                        h.impact === "positive" ? "bg-jade/[0.04]" : h.impact === "negative" ? "bg-ember/[0.04]" : "bg-mist/50 dark:bg-white/[0.02]"
                      )}
                    >
                      <span className="text-sm flex-shrink-0">{h.emoji}</span>
                      <span className="text-ghost">{h.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="p-5 border-b border-black/[0.04] dark:border-white/[0.04]">
                <h3 className="text-xs font-bold text-ink dark:text-white mb-3">KPIs Principais</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {summary.kpiSnapshot.map((kpi) => (
                    <div key={kpi.label} className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                      <p className="text-[10px] text-ghost">{kpi.label}</p>
                      <p className="text-sm font-bold text-ink dark:text-white mt-0.5">{kpi.value}</p>
                      <p className={cn("text-[10px] font-semibold mt-0.5", trendColors[kpi.trend])}>
                        {kpi.change > 0 ? "+" : ""}{kpi.change}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top content */}
              <div className="p-5 border-b border-black/[0.04] dark:border-white/[0.04]">
                <h3 className="text-xs font-bold text-ink dark:text-white mb-3">Top Conteúdo</h3>
                <div className="space-y-2">
                  {summary.topContent.map((page, i) => (
                    <div key={page.path} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-ghost w-4">{i + 1}.</span>
                        <div>
                          <p className="text-xs font-medium text-ink dark:text-white">{page.title}</p>
                          <p className="text-[10px] text-ghost">{page.path}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-ink dark:text-white">{page.views.toLocaleString()}</p>
                        <p className={cn("text-[10px] font-semibold", page.change > 0 ? "text-jade" : "text-ember")}>
                          {page.change > 0 ? "+" : ""}{page.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-5 border-b border-black/[0.04] dark:border-white/[0.04]">
                <h3 className="text-xs font-bold text-ink dark:text-white mb-3">Insights de IA</h3>
                <ul className="space-y-1.5">
                  {summary.aiInsights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ghost">
                      <CheckCircle2 className="w-3.5 h-3.5 text-jade mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-5">
                <h3 className="text-xs font-bold text-ink dark:text-white mb-3">Recomendações</h3>
                <ol className="space-y-1.5">
                  {summary.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ghost">
                      <span className="text-jade font-bold flex-shrink-0">{i + 1}.</span>
                      {rec}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            /* WhatsApp preview */
            <div className="max-w-sm mx-auto">
              <div className="rounded-xl border bg-[#e5ddd5] dark:bg-[#0b141a] border-black/[0.04] dark:border-white/[0.04] p-4">
                <div className="bg-white dark:bg-[#1f2c34] rounded-lg p-3 shadow-sm">
                  <pre className="text-xs text-ink dark:text-white whitespace-pre-wrap font-body leading-relaxed">
                    {formatWhatsAppSummary(summary)}
                  </pre>
                  <p className="text-[9px] text-ghost text-right mt-2">
                    {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} ✓✓
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "config" && (
        <div className="space-y-4">
          {configs.map((config, i) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-xl border p-5",
                "bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04]",
                !config.enabled && "opacity-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    config.channels.includes("whatsapp") ? "bg-jade/[0.08]" : "bg-sapphire/[0.08]"
                  )}>
                    {config.channels.includes("whatsapp") ? (
                      <MessageCircle className="w-4 h-4 text-jade" />
                    ) : (
                      <Mail className="w-4 h-4 text-sapphire" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink dark:text-white">{config.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className="text-[10px] bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full text-ghost">
                        {config.frequency === "daily" ? "Diário" : config.frequency === "weekly" ? "Semanal" : config.frequency === "biweekly" ? "Quinzenal" : "Mensal"}
                      </span>
                      <span className="text-[10px] bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full text-ghost">
                        {config.timeOfDay}
                      </span>
                      {config.channels.map((ch) => (
                        <span key={ch} className="text-[10px] bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full text-ghost capitalize">
                          {ch}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-ghost">
                      <span>Para: {config.recipients.join(", ")}</span>
                      {config.lastSent && (
                        <span className="ml-3">
                          Último envio: {new Date(config.lastSent).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "w-10 h-5 rounded-full flex items-center transition-colors cursor-pointer",
                  config.enabled ? "bg-jade justify-end" : "bg-ghost/30 justify-start"
                )}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
                </div>
              </div>
            </motion.div>
          ))}

          <button className="w-full rounded-xl border-2 border-dashed border-black/[0.06] dark:border-white/[0.06] p-4 flex items-center justify-center gap-2 text-xs font-medium text-ghost hover:text-ink dark:hover:text-white hover:border-jade/30 transition-colors">
            <Plus className="w-4 h-4" />
            Criar novo agendamento
          </button>
        </div>
      )}
    </div>
  );
}
