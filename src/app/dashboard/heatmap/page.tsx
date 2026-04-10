"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Flame,
  MousePointer2,
  ArrowDown,
  Eye,
  Lock,
  Crown,
  ChevronDown,
} from "lucide-react";
import { getHeatmapPages, type HeatmapPage, type HeatmapPoint } from "@/lib/pulse-ai/heatmap-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

function HeatmapCanvas({ points, width, height }: { points: HeatmapPoint[]; width: number; height: number }) {
  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gradient-to-b from-mist to-mist-2 dark:from-surface-2 dark:to-surface-3" style={{ height }}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full border-t border-black/[0.04] dark:border-white/[0.04]"
            style={{ top: `${(i + 1) * 10}%` }}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full border-l border-black/[0.04] dark:border-white/[0.04]"
            style={{ left: `${(i + 1) * 10}%` }}
          />
        ))}
      </div>

      {/* Heat points */}
      {points.map((point, i) => {
        const size = 12 + (point.value / 100) * 30;
        const opacity = 0.15 + (point.value / 100) * 0.6;
        const hue = Math.max(0, 60 - (point.value / 100) * 60);

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.005, duration: 0.3 }}
            className="absolute rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, hsla(${hue}, 100%, 50%, ${opacity}) 0%, hsla(${hue}, 100%, 50%, 0) 70%)`,
              filter: "blur(3px)",
            }}
          />
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/80 dark:bg-ink/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
        <span className="text-[9px] text-ghost">Frio</span>
        <div className="flex gap-0.5">
          {["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"].map((c) => (
            <div key={c} className="w-3 h-2 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span className="text-[9px] text-ghost">Quente</span>
      </div>
    </div>
  );
}

export default function HeatmapPage() {
  const pages = getHeatmapPages();
  const [selectedPage, setSelectedPage] = useState<HeatmapPage>(pages[0]);
  const [view, setView] = useState<"clicks" | "scroll">("clicks");

  const scrollData = selectedPage.scrollDepth.map((d) => ({
    depth: `${d.depth}%`,
    percentage: d.percentage,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-ember" />
            Heatmap
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-gold/20 to-ember/20 text-gold">
              <Crown className="w-3 h-3 inline mr-0.5" />
              Premium
            </span>
          </h1>
          <p className="text-sm text-ghost mt-1">
            Visualize onde os visitantes clicam e até onde fazem scroll.
          </p>
        </div>
      </div>

      {/* Page selector & View toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <select
            value={selectedPage.path}
            onChange={(e) => setSelectedPage(pages.find((p) => p.path === e.target.value) || pages[0])}
            className="appearance-none w-full sm:w-64 pl-3 pr-8 py-2 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-surface text-sm text-ink dark:text-white cursor-pointer"
          >
            {pages.map((p) => (
              <option key={p.path} value={p.path}>{p.title} ({p.path})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost pointer-events-none" />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-mist dark:bg-white/[0.04] w-fit">
          <button
            onClick={() => setView("clicks")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              view === "clicks"
                ? "bg-white dark:bg-surface shadow-sm text-ink dark:text-white"
                : "text-ghost"
            )}
          >
            <MousePointer2 className="w-3 h-3" /> Cliques
          </button>
          <button
            onClick={() => setView("scroll")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              view === "scroll"
                ? "bg-white dark:bg-surface shadow-sm text-ink dark:text-white"
                : "text-ghost"
            )}
          >
            <ArrowDown className="w-3 h-3" /> Scroll Depth
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total de Cliques", value: selectedPage.totalClicks.toLocaleString(), icon: MousePointer2, color: "text-ember" },
          { label: "Sessões Analisadas", value: selectedPage.totalSessions.toLocaleString(), icon: Eye, color: "text-sapphire" },
          { label: "Scroll Médio", value: `${selectedPage.avgScrollDepth}%`, icon: ArrowDown, color: "text-jade" },
          { label: "Zonas de Calor", value: selectedPage.zones.length.toString(), icon: Flame, color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-[10px] text-ghost">{stat.label}</span>
            </div>
            <p className="text-lg font-display font-bold text-ink dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {view === "clicks" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Heatmap visualization */}
          <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-ink dark:text-white mb-3">
              Mapa de Calor — {selectedPage.title}
            </h3>
            <HeatmapCanvas points={selectedPage.clickPoints} width={600} height={400} />
          </div>

          {/* Click zones */}
          <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
            <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">Zonas de Interação</h3>
            <div className="space-y-3">
              {selectedPage.zones.map((zone, i) => {
                const engColors = {
                  high: "bg-jade/10 text-jade",
                  medium: "bg-gold/10 text-gold",
                  low: "bg-ghost/10 text-ghost",
                };
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.015] hover:bg-mist/60 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-ink dark:text-white">{zone.label}</p>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", engColors[zone.engagement])}>
                        {zone.engagement === "high" ? "Alto" : zone.engagement === "medium" ? "Médio" : "Baixo"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-ghost">
                      <span>{zone.clicks.toLocaleString()} cliques</span>
                      <span>{zone.percentage}%</span>
                      <span>{zone.avgTimeVisible} visível</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 rounded-full bg-mist-2 dark:bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-ember transition-all"
                        style={{ width: `${zone.percentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Scroll depth view */
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-1">
            Scroll Depth — {selectedPage.title}
          </h3>
          <p className="text-xs text-ghost mb-4">
            Percentual de visitantes que alcançam cada profundidade da página.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scrollData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#9BA0AE" }} />
                <YAxis type="category" dataKey="depth" tick={{ fontSize: 10, fill: "#9BA0AE" }} width={40} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-ink-2 border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-xs font-medium text-ink dark:text-white">Profundidade: {d.depth}</p>
                        <p className="text-xs text-ghost">{d.percentage}% dos visitantes</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {scrollData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${150 - i * 12}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
