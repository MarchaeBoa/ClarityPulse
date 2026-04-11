"use client";

import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { Globe, ArrowUpRight, MapPin } from "lucide-react";

const FLAG_EMOJI: Record<string, string> = {
  US: "\u{1F1FA}\u{1F1F8}",
  BR: "\u{1F1E7}\u{1F1F7}",
  GB: "\u{1F1EC}\u{1F1E7}",
  DE: "\u{1F1E9}\u{1F1EA}",
  IN: "\u{1F1EE}\u{1F1F3}",
  CA: "\u{1F1E8}\u{1F1E6}",
  FR: "\u{1F1EB}\u{1F1F7}",
  AU: "\u{1F1E6}\u{1F1FA}",
  JP: "\u{1F1EF}\u{1F1F5}",
  NL: "\u{1F1F3}\u{1F1F1}",
  PT: "\u{1F1F5}\u{1F1F9}",
  ES: "\u{1F1EA}\u{1F1F8}",
  IT: "\u{1F1EE}\u{1F1F9}",
  MX: "\u{1F1F2}\u{1F1FD}",
  AR: "\u{1F1E6}\u{1F1F7}",
  CO: "\u{1F1E8}\u{1F1F4}",
  CL: "\u{1F1E8}\u{1F1F1}",
  KR: "\u{1F1F0}\u{1F1F7}",
  CN: "\u{1F1E8}\u{1F1F3}",
  SE: "\u{1F1F8}\u{1F1EA}",
  SG: "\u{1F1F8}\u{1F1EC}",
  ID: "\u{1F1EE}\u{1F1E9}",
  TH: "\u{1F1F9}\u{1F1ED}",
  PH: "\u{1F1F5}\u{1F1ED}",
  VN: "\u{1F1FB}\u{1F1F3}",
  ZA: "\u{1F1FF}\u{1F1E6}",
  NG: "\u{1F1F3}\u{1F1EC}",
  AE: "\u{1F1E6}\u{1F1EA}",
  IL: "\u{1F1EE}\u{1F1F1}",
  TR: "\u{1F1F9}\u{1F1F7}",
  RU: "\u{1F1F7}\u{1F1FA}",
  UA: "\u{1F1FA}\u{1F1E6}",
  PL: "\u{1F1F5}\u{1F1F1}",
  CZ: "\u{1F1E8}\u{1F1FF}",
  RO: "\u{1F1F7}\u{1F1F4}",
  HU: "\u{1F1ED}\u{1F1FA}",
  GR: "\u{1F1EC}\u{1F1F7}",
  TW: "\u{1F1F9}\u{1F1FC}",
  HK: "\u{1F1ED}\u{1F1F0}",
  NZ: "\u{1F1F3}\u{1F1FF}",
  IE: "\u{1F1EE}\u{1F1EA}",
  CH: "\u{1F1E8}\u{1F1ED}",
  AT: "\u{1F1E6}\u{1F1F9}",
  BE: "\u{1F1E7}\u{1F1EA}",
  NO: "\u{1F1F3}\u{1F1F4}",
  DK: "\u{1F1E9}\u{1F1F0}",
  FI: "\u{1F1EB}\u{1F1EE}",
  MY: "\u{1F1F2}\u{1F1FE}",
  EG: "\u{1F1EA}\u{1F1EC}",
};

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-28 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-40 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <div className="w-28 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
              <div className="w-16 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            </div>
            <div className="w-full h-1.5 rounded-full bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyGeo() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 flex flex-col items-center justify-center min-h-[300px]">
      <MapPin className="w-10 h-10 text-ghost/20 mb-3" />
      <p className="text-sm font-medium text-ghost/60">No geographic data</p>
      <p className="text-xs text-ghost/40 mt-1">Country data will appear here</p>
    </div>
  );
}

export function GeoBreakdown() {
  const { data, loading } = useDashboard();

  if (loading) return <CardSkeleton />;
  if (!data || data.geoBreakdown.length === 0) return <EmptyGeo />;

  const countries = data.geoBreakdown;
  const maxVisitors = countries[0]?.visitors ?? 1;

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
          <p className="text-lg font-display font-bold text-ink dark:text-white">
            {data.totalCountries} {data.totalCountries === 1 ? "country" : "countries"}
          </p>
          <p className="text-[11px] text-ghost">Visitors from around the world</p>
        </div>
      </div>

      {/* Country list */}
      <div className="space-y-2.5">
        {countries.map((c, i) => {
          const flag = FLAG_EMOJI[c.countryCode] ?? "\u{1F30D}";
          return (
            <div key={c.countryCode} className="group">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-sm leading-none">{flag}</span>
                <span className="text-xs font-medium text-ink dark:text-white flex-1 truncate">
                  {c.countryName}
                </span>
                <span className="text-[11px] text-ghost tabular-nums">
                  {c.visitors.toLocaleString()}
                </span>
                <span className="text-[11px] text-ghost/60 tabular-nums w-10 text-right">
                  {c.percentage}%
                </span>
              </div>
              <div className="h-1 bg-mist dark:bg-white/[0.03] rounded-full overflow-hidden ml-6">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    i === 0
                      ? "bg-jade"
                      : i === 1
                        ? "bg-sapphire"
                        : "bg-ghost/20 dark:bg-white/10"
                  )}
                  style={{ width: `${(c.visitors / maxVisitors) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
