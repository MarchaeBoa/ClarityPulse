"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  AlertTriangle,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { getChannelBenchmarks } from "@/lib/pulse-ai/benchmarks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const statusConfig = {
  above: { icon: TrendingUp, color: "text-jade", bg: "bg-jade/[0.08]", label: "Acima", barColor: "#1AE5A0" },
  at: { icon: Minus, color: "text-gold", bg: "bg-gold/[0.08]", label: "Na média", barColor: "#F0A500" },
  below: { icon: TrendingDown, color: "text-ember", bg: "bg-ember/[0.08]", label: "Abaixo", barColor: "#F5653A" },
};

export default function BenchmarksPage() {
  const data = getChannelBenchmarks();

  const chartData = data.channels.map((ch) => ({
    name: ch.channel.replace(" ", "\n"),
    "Sua Conv. (%)": ch.metrics[0].yours,
    "Indústria (%)": ch.metrics[0].industry,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-sapphire" />
          Benchmark por Canal
        </h1>
        <p className="text-sm text-ghost mt-1">
          Compare seus canais com a média da indústria SaaS.
        </p>
      </div>

      {/* Summary banner */}
      <div className="rounded-xl border bg-gradient-to-r from-sapphire/5 to-jade/5 dark:from-sapphire/[0.03] dark:to-jade/[0.03] border-sapphire/10 p-4">
        <p className="text-sm text-ink dark:text-white leading-relaxed">{data.summary}</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-[10px] bg-jade/10 text-jade px-2 py-0.5 rounded-full font-semibold">
            <Trophy className="w-3 h-3 inline mr-0.5" /> Melhor: {data.bestChannel}
          </span>
          <span className="text-[10px] bg-ember/10 text-ember px-2 py-0.5 rounded-full font-semibold">
            <AlertTriangle className="w-3 h-3 inline mr-0.5" /> Atenção: {data.worstChannel}
          </span>
        </div>
      </div>

      {/* Comparison chart */}
      <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
        <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Taxa de Conversão: Você vs Indústria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9BA0AE" }} />
              <YAxis tick={{ fontSize: 10, fill: "#9BA0AE" }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white dark:bg-ink-2 border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-xs font-medium text-ink dark:text-white mb-1">{label}</p>
                      {payload.map((p) => (
                        <p key={p.name} className="text-xs text-ghost">
                          {p.name}: <strong>{p.value}%</strong>
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Sua Conv. (%)" fill="#1AE5A0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Indústria (%)" fill="#3B7BF8" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel cards */}
      <div className="space-y-4">
        {data.channels.map((channel, i) => (
          <motion.div
            key={channel.channel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-ink dark:text-white">{channel.channel}</h3>
                <p className="text-xs text-ghost mt-0.5">{channel.verdict}</p>
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold",
                channel.overallScore >= 75 ? "bg-jade/10 text-jade" :
                channel.overallScore >= 50 ? "bg-gold/10 text-gold" :
                "bg-ember/10 text-ember"
              )}>
                Score: {channel.overallScore}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {channel.metrics.map((metric) => {
                const st = statusConfig[metric.status];
                const StIcon = st.icon;
                return (
                  <div key={metric.label} className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015]">
                    <p className="text-[10px] text-ghost mb-1">{metric.label}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-ink dark:text-white">
                        {metric.yours}{metric.unit}
                      </p>
                      <span className={cn("text-[10px] font-semibold", st.color)}>
                        {metric.delta > 0 ? "+" : ""}{metric.delta}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", st.bg, st.color)}>
                        {st.label}
                      </span>
                      <span className="text-[9px] text-ghost">
                        Indústria: {metric.industry}{metric.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
