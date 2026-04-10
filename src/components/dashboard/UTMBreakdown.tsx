"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

type Tab = "source" | "medium" | "campaign";

interface UTMEntry {
  name: string;
  visitors: number;
  conversions: number;
  convRate: number;
  change: number;
}

const utmData: Record<Tab, UTMEntry[]> = {
  source: [
    { name: "google", visitors: 6866, conversions: 412, convRate: 6.0, change: 12.3 },
    { name: "facebook", visitors: 2840, conversions: 184, convRate: 6.5, change: 8.5 },
    { name: "twitter", visitors: 1520, conversions: 76, convRate: 5.0, change: -3.2 },
    { name: "linkedin", visitors: 1280, conversions: 102, convRate: 8.0, change: 22.1 },
    { name: "newsletter", visitors: 1226, conversions: 98, convRate: 8.0, change: 15.4 },
    { name: "producthunt", visitors: 890, conversions: 62, convRate: 7.0, change: 45.2 },
  ],
  medium: [
    { name: "organic", visitors: 8420, conversions: 506, convRate: 6.0, change: 10.8 },
    { name: "cpc", visitors: 3240, conversions: 227, convRate: 7.0, change: 18.2 },
    { name: "social", visitors: 4360, conversions: 218, convRate: 5.0, change: 5.4 },
    { name: "email", visitors: 1226, conversions: 98, convRate: 8.0, change: 15.4 },
    { name: "referral", visitors: 2942, conversions: 148, convRate: 5.0, change: 7.2 },
  ],
  campaign: [
    { name: "spring-launch-2024", visitors: 4520, conversions: 362, convRate: 8.0, change: 35.6 },
    { name: "product-update-v2", visitors: 2840, conversions: 170, convRate: 6.0, change: 12.3 },
    { name: "webinar-analytics", visitors: 1680, conversions: 134, convRate: 8.0, change: 28.4 },
    { name: "black-friday", visitors: 1240, conversions: 112, convRate: 9.0, change: -15.2 },
    { name: "partner-collab", visitors: 890, conversions: 54, convRate: 6.1, change: 8.7 },
  ],
};

const tabs: { label: string; value: Tab }[] = [
  { label: "Source", value: "source" },
  { label: "Medium", value: "medium" },
  { label: "Campaign", value: "campaign" },
];

export function UTMBreakdown() {
  const [activeTab, setActiveTab] = useState<Tab>("source");
  const data = utmData[activeTab];
  const maxVisitors = Math.max(...data.map((d) => d.visitors));

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">UTM Campaigns</h3>
          <p className="text-xs text-ghost mt-0.5">Campaign performance breakdown</p>
        </div>
        <button className="text-xs text-jade hover:text-jade-hover font-medium flex items-center gap-1 transition-colors">
          Details <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-mist dark:bg-white/[0.04] rounded-lg p-0.5 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
              activeTab === tab.value
                ? "bg-white dark:bg-white/[0.08] text-ink dark:text-white shadow-sm"
                : "text-ghost hover:text-ink dark:hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data list */}
      <div className="space-y-3">
        {data.map((entry) => (
          <div key={entry.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-medium text-ink dark:text-white truncate max-w-[140px]">
                {entry.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-ghost tabular-nums">
                  {entry.visitors.toLocaleString()} visits
                </span>
                <span className="text-[11px] font-medium text-ink dark:text-white tabular-nums w-12 text-right">
                  {entry.convRate}% CR
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold flex items-center gap-0.5 w-14 justify-end",
                    entry.change > 0 ? "text-jade" : "text-ember"
                  )}
                >
                  {entry.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(entry.change)}%
                </span>
              </div>
            </div>
            <div className="h-1 bg-mist dark:bg-white/[0.03] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-jade/40 dark:bg-jade/30 transition-all duration-500"
                style={{ width: `${(entry.visitors / maxVisitors) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
