"use client";

import { cn } from "@/lib/utils";
import { Globe, ArrowUpRight } from "lucide-react";

interface Country {
  code: string;
  name: string;
  flag: string;
  visitors: number;
  pct: number;
  change: number;
}

const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", visitors: 8420, pct: 34.4, change: 8.2 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", visitors: 4210, pct: 17.2, change: 25.6 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", visitors: 2840, pct: 11.6, change: 5.1 },
  { code: "DE", name: "Germany", flag: "🇩🇪", visitors: 2150, pct: 8.8, change: 12.3 },
  { code: "IN", name: "India", flag: "🇮🇳", visitors: 1820, pct: 7.4, change: 32.1 },
  { code: "CA", name: "Canada", flag: "🇨🇦", visitors: 1280, pct: 5.2, change: -2.4 },
  { code: "FR", name: "France", flag: "🇫🇷", visitors: 1050, pct: 4.3, change: 8.7 },
  { code: "AU", name: "Australia", flag: "🇦🇺", visitors: 890, pct: 3.6, change: 15.2 },
  { code: "JP", name: "Japan", flag: "🇯🇵", visitors: 720, pct: 2.9, change: 18.4 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", visitors: 640, pct: 2.6, change: 6.8 },
];

const maxVisitors = countries[0].visitors;

export function GeoBreakdown() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Geography</h3>
          <p className="text-xs text-ghost mt-0.5">Visitors by country</p>
        </div>
        <button className="text-xs text-jade hover:text-jade-hover font-medium flex items-center gap-1 transition-colors">
          Map view <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Globe summary */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-mist/50 dark:bg-white/[0.02] mb-4">
        <div className="w-9 h-9 rounded-lg bg-sapphire/[0.08] flex items-center justify-center">
          <Globe className="w-4.5 h-4.5 text-sapphire" />
        </div>
        <div>
          <p className="text-lg font-display font-bold text-ink dark:text-white">42 countries</p>
          <p className="text-[11px] text-ghost">Visitors from around the world</p>
        </div>
      </div>

      {/* Country list */}
      <div className="space-y-2.5">
        {countries.map((c, i) => (
          <div key={c.code} className="group">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-sm leading-none">{c.flag}</span>
              <span className="text-xs font-medium text-ink dark:text-white flex-1 truncate">{c.name}</span>
              <span className="text-[11px] text-ghost tabular-nums">
                {c.visitors.toLocaleString()}
              </span>
              <span className="text-[11px] text-ghost/60 tabular-nums w-10 text-right">{c.pct}%</span>
            </div>
            <div className="h-1 bg-mist dark:bg-white/[0.03] rounded-full overflow-hidden ml-6">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  i === 0 ? "bg-jade" : i === 1 ? "bg-sapphire" : "bg-ghost/20 dark:bg-white/10"
                )}
                style={{ width: `${(c.visitors / maxVisitors) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
