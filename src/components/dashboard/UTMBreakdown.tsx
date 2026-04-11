"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { ArrowUpRight, LinkIcon } from "lucide-react";

type Tab = "source" | "medium" | "campaign";

const tabs: { label: string; value: Tab }[] = [
  { label: "Source", value: "source" },
  { label: "Medium", value: "medium" },
  { label: "Campaign", value: "campaign" },
];

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-28 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-40 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="w-full h-8 mb-4 rounded-lg bg-mist dark:bg-white/[0.04] animate-pulse" />
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

function EmptyUTM() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5 flex flex-col items-center justify-center min-h-[300px]">
      <LinkIcon className="w-10 h-10 text-ghost/20 mb-3" />
      <p className="text-sm font-medium text-ghost/60">No UTM data</p>
      <p className="text-xs text-ghost/40 mt-1">Campaign data will appear when UTM tags are used</p>
    </div>
  );
}

export function UTMBreakdown() {
  const [activeTab, setActiveTab] = useState<Tab>("source");
  const { data, loading } = useDashboard();

  if (loading) return <CardSkeleton />;

  const tabData =
    activeTab === "source"
      ? data?.utmSources
      : activeTab === "medium"
        ? data?.utmMediums
        : data?.utmCampaigns;

  const entries = tabData ?? [];
  const hasAnyData =
    (data?.utmSources?.length ?? 0) > 0 ||
    (data?.utmMediums?.length ?? 0) > 0 ||
    (data?.utmCampaigns?.length ?? 0) > 0;

  if (!data || !hasAnyData) return <EmptyUTM />;

  const maxVisitors = Math.max(...entries.map((d) => d.visitors), 1);

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
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xs text-ghost/50">No {activeTab} data for this period</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-medium text-ink dark:text-white truncate max-w-[140px]">
                  {entry.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-ghost tabular-nums">
                    {entry.visitors.toLocaleString()} visits
                  </span>
                  {entry.convRate > 0 && (
                    <span className="text-[11px] font-medium text-ink dark:text-white tabular-nums w-12 text-right">
                      {entry.convRate}% CR
                    </span>
                  )}
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
      )}
    </div>
  );
}
