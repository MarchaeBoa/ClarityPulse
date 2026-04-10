"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellRing,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Mail,
  MessageCircle,
  Monitor,
  Settings,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import {
  generateSmartAlerts,
  getDefaultAlertRules,
  type SmartAlert,
  type AlertRule,
} from "@/lib/pulse-ai/alerts-engine";

const priorityConfig = {
  urgent: { color: "text-ember", bg: "bg-ember/[0.08]", border: "border-ember/20", label: "Urgente", icon: AlertTriangle },
  important: { color: "text-gold", bg: "bg-gold/[0.08]", border: "border-gold/20", label: "Importante", icon: BellRing },
  info: { color: "text-sapphire", bg: "bg-sapphire/[0.08]", border: "border-sapphire/20", label: "Info", icon: Bell },
};

const channelIcons: Record<string, React.ElementType> = {
  dashboard: Monitor,
  email: Mail,
  whatsapp: MessageCircle,
  slack: Zap,
};

const statusConfig = {
  new: { label: "Novo", color: "bg-jade text-white" },
  seen: { label: "Visto", color: "bg-ghost/20 text-ghost" },
  dismissed: { label: "Dispensado", color: "bg-mist dark:bg-white/5 text-ghost/60" },
  acted: { label: "Resolvido", color: "bg-jade/10 text-jade" },
};

export default function AlertsPage() {
  const alerts = generateSmartAlerts();
  const rules = getDefaultAlertRules();
  const [expandedAlert, setExpandedAlert] = useState<string | null>(alerts[0]?.id || null);
  const [tab, setTab] = useState<"alerts" | "rules">("alerts");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAlerts = statusFilter === "all"
    ? alerts
    : alerts.filter((a) => a.status === statusFilter);

  const urgentCount = alerts.filter((a) => a.priority === "urgent" && a.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
            <BellRing className="w-6 h-6 text-gold" />
            Alertas Inteligentes
          </h1>
          <p className="text-sm text-ghost mt-1">
            Notificações automáticas sobre anomalias e tendências.
          </p>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ember/10 border border-ember/20">
            <AlertTriangle className="w-3.5 h-3.5 text-ember" />
            <span className="text-xs font-semibold text-ember">{urgentCount} alerta(s) urgente(s)</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-mist dark:bg-white/[0.04] w-fit">
        {[
          { id: "alerts" as const, label: "Alertas", count: alerts.length },
          { id: "rules" as const, label: "Regras", count: rules.length },
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
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === "alerts" && (
        <>
          {/* Status filter */}
          <div className="flex gap-2 text-xs">
            {[
              { value: "all", label: "Todos" },
              { value: "new", label: "Novos" },
              { value: "seen", label: "Vistos" },
              { value: "dismissed", label: "Dispensados" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "px-2.5 py-1 rounded-full font-medium transition-colors",
                  statusFilter === f.value
                    ? "bg-jade/10 text-jade"
                    : "text-ghost hover:bg-mist dark:hover:bg-white/[0.04]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Alert cards */}
          <div className="space-y-3">
            {filteredAlerts.map((alert, i) => {
              const config = priorityConfig[alert.priority];
              const PriorityIcon = config.icon;
              const isExpanded = expandedAlert === alert.id;
              const stConfig = statusConfig[alert.status];

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className={cn(
                    "rounded-xl border overflow-hidden transition-all duration-200",
                    "bg-white dark:bg-surface",
                    alert.status === "dismissed"
                      ? "border-black/[0.02] dark:border-white/[0.02] opacity-60"
                      : "border-black/[0.04] dark:border-white/[0.04]",
                    alert.priority === "urgent" && alert.status === "new" && "border-l-2 border-l-ember"
                  )}
                >
                  {/* Alert header */}
                  <button
                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                    className="w-full p-4 flex items-start gap-3 text-left"
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                      <PriorityIcon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-ink dark:text-white">
                          {alert.title}
                        </h3>
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", stConfig.color)}>
                          {stConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-ghost line-clamp-2">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-ghost">
                          {new Date(alert.createdAt).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <div className="flex gap-1">
                          {alert.channels.map((ch) => {
                            const ChIcon = channelIcons[ch] || Monitor;
                            return (
                              <ChIcon key={ch} className="w-3 h-3 text-ghost/50" title={ch} />
                            );
                          })}
                        </div>
                        <span className={cn("text-[10px] font-bold", alert.changePercent > 0 ? "text-jade" : "text-ember")}>
                          {alert.changePercent > 0 ? "+" : ""}{alert.changePercent}%
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-ghost flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ghost flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 border-t border-black/[0.04] dark:border-white/[0.04]"
                    >
                      <div className="pt-4 space-y-4">
                        {/* Explanation */}
                        <div className="p-3 rounded-lg bg-mist/50 dark:bg-white/[0.02]">
                          <p className="text-xs font-semibold text-ink dark:text-white mb-1">Por que isso aconteceu?</p>
                          <p className="text-xs text-ghost leading-relaxed">{alert.explanation}</p>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                            <p className="text-[10px] text-ghost mb-1">Métrica</p>
                            <p className="text-xs font-bold text-ink dark:text-white">{alert.metric}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                            <p className="text-[10px] text-ghost mb-1">Anterior</p>
                            <p className="text-xs font-bold text-ink dark:text-white">{alert.previousValue}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                            <p className="text-[10px] text-ghost mb-1">Atual</p>
                            <p className="text-xs font-bold text-ink dark:text-white">{alert.currentValue}</p>
                          </div>
                        </div>

                        {/* Suggested action */}
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-jade/[0.04] border border-jade/10">
                          <CheckCircle2 className="w-4 h-4 text-jade mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[11px] font-semibold text-jade mb-0.5">Ação sugerida</p>
                            <p className="text-xs text-ghost">{alert.suggestedAction}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {tab === "rules" && (
        <div className="space-y-3">
          <p className="text-xs text-ghost">Configure regras automáticas para receber alertas quando métricas atingirem limites definidos.</p>
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-xl border p-4 flex items-center gap-4",
                "bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04]",
                !rule.enabled && "opacity-50"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                rule.enabled ? "bg-jade/[0.08]" : "bg-ghost/[0.08]"
              )}>
                <Settings className={cn("w-4 h-4", rule.enabled ? "text-jade" : "text-ghost")} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-ink dark:text-white">{rule.name}</h4>
                <p className="text-xs text-ghost mt-0.5">{rule.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full text-ghost">
                    {rule.condition === "drops_below" ? "Cai abaixo de" : rule.condition === "rises_above" ? "Sobe acima de" : "Varia mais que"} {rule.threshold}{rule.metric.includes("rate") ? "%" : ""}
                  </span>
                  <div className="flex gap-1">
                    {rule.channels.map((ch) => {
                      const ChIcon = channelIcons[ch] || Monitor;
                      return <ChIcon key={ch} className="w-3 h-3 text-ghost/50" title={ch} />;
                    })}
                  </div>
                </div>
              </div>
              <div className={cn(
                "w-10 h-5 rounded-full flex items-center transition-colors cursor-pointer",
                rule.enabled ? "bg-jade justify-end" : "bg-ghost/30 justify-start"
              )}>
                <div className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
