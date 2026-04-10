"use client";

import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Globe, Search, Share2, Link2, Mail, DollarSign } from "lucide-react";

const sources = [
  { name: "Direct", value: 35, color: "#1AE5A0", icon: Globe, visitors: "8,582" },
  { name: "Organic Search", value: 28, color: "#3B7BF8", icon: Search, visitors: "6,866" },
  { name: "Social", value: 18, color: "#A855F7", icon: Share2, visitors: "4,414" },
  { name: "Referral", value: 12, color: "#F0A500", icon: Link2, visitors: "2,942" },
  { name: "Email", value: 5, color: "#F5653A", icon: Mail, visitors: "1,226" },
  { name: "Paid", value: 2, color: "#EC4899", icon: DollarSign, visitors: "491" },
];

export function TrafficSources() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Traffic Sources</h3>
        <p className="text-xs text-ghost mt-0.5">Where your visitors come from</p>
      </div>

      {/* Donut chart */}
      <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sources}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {sources.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-ink-2 border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-xs font-medium text-ink dark:text-white">{d.name}</p>
                    <p className="text-xs text-ghost">{d.value}% &middot; {d.visitors}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-bold text-ink dark:text-white">24.5k</span>
          <span className="text-[11px] text-ghost">total</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2 flex-1">
        {sources.map((s) => (
          <div key={s.name} className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-ghost flex-1 truncate">{s.name}</span>
            <span className="text-xs font-medium text-ink dark:text-white tabular-nums">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
