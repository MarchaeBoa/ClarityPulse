"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Bell,
  FileText,
  ExternalLink,
  Search,
  Plus,
  AlertTriangle,
  Trophy,
  Zap,
  Clock,
  Activity,
} from "lucide-react";
import { getAgencyOverview, type AgencyClient } from "@/lib/agency";

const statusConfig = {
  active: { label: "Ativo", color: "bg-jade text-white" },
  paused: { label: "Pausado", color: "bg-ghost/20 text-ghost" },
  onboarding: { label: "Onboarding", color: "bg-sapphire/20 text-sapphire" },
  churned: { label: "Churn", color: "bg-ember/20 text-ember" },
};

const activityIcons: Record<string, React.ElementType> = {
  alert: AlertTriangle,
  report: FileText,
  milestone: Trophy,
  issue: Zap,
};

const activityColors: Record<string, string> = {
  alert: "text-gold bg-gold/[0.08]",
  report: "text-sapphire bg-sapphire/[0.08]",
  milestone: "text-jade bg-jade/[0.08]",
  issue: "text-ember bg-ember/[0.08]",
};

export default function AgencyPage() {
  const overview = getAgencyOverview();
  const [search, setSearch] = useState("");

  const filteredClients = overview.clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sapphire" />
            Modo Agência
          </h1>
          <p className="text-sm text-ghost mt-1">
            Gerencie todos os seus clientes em um só lugar.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jade text-white text-xs font-semibold hover:bg-jade-hover transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Novo Cliente
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Clientes", value: overview.totalClients.toString(), icon: Users, color: "text-sapphire" },
          { label: "Ativos", value: overview.activeClients.toString(), icon: Activity, color: "text-jade" },
          { label: "Visitantes Total", value: `${(overview.totalVisitors / 1000).toFixed(0)}k`, icon: TrendingUp, color: "text-jade" },
          { label: "Conversões Total", value: overview.totalConversions.toLocaleString(), icon: Target, color: "text-gold" },
          { label: "Receita Total", value: `$${(overview.totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-jade" },
          { label: "Health Médio", value: `${overview.avgHealthScore}/100`, icon: Activity, color: overview.avgHealthScore >= 70 ? "text-jade" : "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
              <span className="text-[10px] text-ghost">{stat.label}</span>
            </div>
            <p className="text-lg font-display font-bold text-ink dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-surface text-sm text-ink dark:text-white placeholder:text-ghost"
            />
          </div>

          {/* Client cards */}
          <div className="space-y-3">
            {filteredClients.map((client, i) => {
              const st = statusConfig[client.status];

              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "rounded-xl border p-4 transition-all duration-200 cursor-pointer",
                    "bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04]",
                    "hover:border-black/[0.08] dark:hover:border-white/[0.08]",
                    "hover:shadow-sm",
                    client.status === "paused" && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Logo/Initials */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                      client.metrics.healthScore >= 80 ? "bg-jade/10 text-jade" :
                      client.metrics.healthScore >= 60 ? "bg-gold/10 text-gold" :
                      "bg-ember/10 text-ember"
                    )}>
                      {client.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-ink dark:text-white">{client.name}</h3>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", st.color)}>
                          {st.label}
                        </span>
                        <span className="text-[9px] text-ghost bg-mist dark:bg-white/[0.04] px-1.5 py-0.5 rounded-full">
                          {client.plan}
                        </span>
                        {client.alerts > 0 && (
                          <span className="text-[9px] font-bold text-ember bg-ember/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Bell className="w-2.5 h-2.5" /> {client.alerts}
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-ghost mb-2">{client.domain}</p>

                      {client.status !== "paused" && (
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: "Visitantes", value: `${(client.metrics.visitors / 1000).toFixed(1)}k`, change: client.metrics.visitorsChange },
                            { label: "Conversões", value: client.metrics.conversions.toLocaleString(), change: client.metrics.conversionsChange },
                            { label: "Receita", value: `$${(client.metrics.revenue / 1000).toFixed(0)}k`, change: client.metrics.revenueChange },
                            { label: "Health", value: `${client.metrics.healthScore}`, change: 0 },
                          ].map((m) => (
                            <div key={m.label}>
                              <p className="text-[9px] text-ghost">{m.label}</p>
                              <p className="text-xs font-bold text-ink dark:text-white">{m.value}</p>
                              {m.change !== 0 && (
                                <p className={cn("text-[9px] font-semibold", m.change > 0 ? "text-jade" : "text-ember")}>
                                  {m.change > 0 ? "+" : ""}{m.change}%
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        {client.tags.map((tag) => (
                          <span key={tag} className="text-[9px] text-ghost bg-mist dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 h-fit">
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {overview.recentActivity.map((activity, i) => {
              const ActIcon = activityIcons[activity.type] || Bell;
              const actColor = activityColors[activity.type] || "text-ghost bg-ghost/[0.08]";

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3"
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", actColor)}>
                    <ActIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-ghost leading-relaxed">
                      <strong className="text-ink dark:text-white">{activity.client}</strong> — {activity.message}
                    </p>
                    <p className="text-[10px] text-ghost/60 mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(activity.timestamp).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
