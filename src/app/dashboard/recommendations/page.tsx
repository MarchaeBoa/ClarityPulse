"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  ArrowRight,
  Clock,
  Zap,
  Target,
  BarChart3,
  FileText,
  Settings,
  Palette,
  CheckCircle2,
  Circle,
  TrendingUp,
} from "lucide-react";
import { generateRecommendations, type Recommendation } from "@/lib/pulse-ai/recommendations";

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  conversion: { icon: Target, color: "text-jade", bg: "bg-jade/[0.08]", label: "Conversão" },
  traffic: { icon: TrendingUp, color: "text-sapphire", bg: "bg-sapphire/[0.08]", label: "Tráfego" },
  content: { icon: FileText, color: "text-gold", bg: "bg-gold/[0.08]", label: "Conteúdo" },
  technical: { icon: Settings, color: "text-ember", bg: "bg-ember/[0.08]", label: "Técnico" },
  campaign: { icon: BarChart3, color: "text-sapphire", bg: "bg-sapphire/[0.08]", label: "Campanha" },
  ux: { icon: Palette, color: "text-gold", bg: "bg-gold/[0.08]", label: "UX" },
};

const effortConfig = {
  low: { label: "Baixo Esforço", color: "text-jade", bg: "bg-jade/10" },
  medium: { label: "Esforço Médio", color: "text-gold", bg: "bg-gold/10" },
  high: { label: "Alto Esforço", color: "text-ember", bg: "bg-ember/10" },
};

const impactConfig = {
  high: { label: "Alto Impacto", color: "text-jade", bg: "bg-jade/10" },
  medium: { label: "Impacto Médio", color: "text-gold", bg: "bg-gold/10" },
  low: { label: "Baixo Impacto", color: "text-ghost", bg: "bg-ghost/10" },
};

export default function RecommendationsPage() {
  const recommendations = generateRecommendations();
  const [expandedRec, setExpandedRec] = useState<string | null>(recommendations[0]?.id || null);

  const quickWins = recommendations.filter((r) => r.effort === "low" && r.impact === "high");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-gold" />
          Recomendações Acionáveis
        </h1>
        <p className="text-sm text-ghost mt-1">
          Ações prioritizadas pela IA para melhorar seus resultados.
        </p>
      </div>

      {/* Quick wins banner */}
      {quickWins.length > 0 && (
        <div className="rounded-xl border bg-gradient-to-r from-gold/5 to-jade/5 dark:from-gold/[0.02] dark:to-jade/[0.02] border-gold/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gold" />
            <p className="text-xs font-bold text-ink dark:text-white">Quick Wins — {quickWins.length} ações de baixo esforço e alto impacto</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickWins.map((qw) => (
              <span key={qw.id} className="text-[10px] bg-jade/10 text-jade px-2 py-1 rounded-full font-medium">
                {qw.title.substring(0, 40)}...
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations list */}
      <div className="space-y-3">
        {recommendations.map((rec, i) => {
          const cat = categoryConfig[rec.category];
          const CatIcon = cat.icon;
          const eff = effortConfig[rec.effort];
          const imp = impactConfig[rec.impact];
          const isExpanded = expandedRec === rec.id;

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedRec(isExpanded ? null : rec.id)}
                className="w-full p-5 flex items-start gap-4 text-left"
              >
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-jade/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-jade">#{rec.priority}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-ink dark:text-white">{rec.title}</h3>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", cat.bg, cat.color)}>{cat.label}</span>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", eff.bg, eff.color)}>{eff.label}</span>
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", imp.bg, imp.color)}>{imp.label}</span>
                  </div>
                  <p className="text-xs text-ghost leading-relaxed">{rec.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-ghost">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-jade" />
                      {rec.estimatedImpact}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.timeToImplement}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-black/[0.04] dark:border-white/[0.04]">
                  <div className="pt-4 space-y-4">
                    {/* Reasoning */}
                    <div className="p-3 rounded-lg bg-mist/50 dark:bg-white/[0.02]">
                      <p className="text-[10px] font-bold text-ink dark:text-white mb-1">Por que esta recomendação?</p>
                      <p className="text-xs text-ghost leading-relaxed">{rec.reasoning}</p>
                    </div>

                    {/* Steps */}
                    <div>
                      <p className="text-[10px] font-bold text-ink dark:text-white mb-2">Passos para implementar</p>
                      <div className="space-y-1.5">
                        {rec.steps.map((step, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <Circle className="w-3 h-3 text-ghost mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-ghost">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projected metrics */}
                    <div>
                      <p className="text-[10px] font-bold text-ink dark:text-white mb-2">Impacto Projetado</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {rec.metrics.map((m) => (
                          <div key={m.label} className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                            <p className="text-[9px] text-ghost">{m.label}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs text-ghost line-through">{m.current}</span>
                              <ArrowRight className="w-3 h-3 text-ghost" />
                              <span className="text-xs font-bold text-jade">{m.projected}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
