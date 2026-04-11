"use client";

import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import { ArrowUpRight, FileText } from "lucide-react";

function formatDuration(sec: number): string {
  if (sec < 60) return `0:${sec.toString().padStart(2, "0")}`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-24 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-36 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
        <div className="w-16 h-4 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex-1 h-4 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="w-12 h-4 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="w-10 h-4 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="w-10 h-4 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyTable() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Top Pages</h3>
        <p className="text-xs text-ghost mt-0.5">Most visited pages this period</p>
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <FileText className="w-10 h-10 text-ghost/20 mb-3" />
        <p className="text-sm font-medium text-ghost/60">No page data yet</p>
        <p className="text-xs text-ghost/40 mt-1">Pages will appear once visitors arrive</p>
      </div>
    </div>
  );
}

export function TopPages() {
  const { data, loading } = useDashboard();

  if (loading) return <TableSkeleton />;
  if (!data || data.topPages.length === 0) return <EmptyTable />;

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Top Pages</h3>
          <p className="text-xs text-ghost mt-0.5">Most visited pages this period</p>
        </div>
        <button className="text-xs text-jade hover:text-jade-hover font-medium flex items-center gap-1 transition-colors">
          View all <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-5">
        <table className="w-full min-w-[440px]">
          <thead>
            <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
              {["Page", "Views", "Uniques", "Bounce", "Duration"].map((h) => (
                <th
                  key={h}
                  className={cn(
                    "text-[11px] font-medium uppercase tracking-wider text-ghost/60 pb-2.5 px-5",
                    h === "Page" ? "text-left" : "text-right"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.topPages.map((page) => (
              <tr
                key={page.path}
                className="group border-b border-black/[0.02] dark:border-white/[0.02] last:border-0 hover:bg-mist/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-5">
                  <span className="text-sm font-medium text-ink dark:text-white truncate max-w-[200px] block font-mono">
                    {page.path}
                  </span>
                </td>
                <td className="text-right px-5">
                  <span className="text-sm tabular-nums text-ink dark:text-white font-medium">
                    {page.views.toLocaleString()}
                  </span>
                </td>
                <td className="text-right px-5">
                  <span className="text-sm tabular-nums text-ghost">
                    {page.uniques.toLocaleString()}
                  </span>
                </td>
                <td className="text-right px-5">
                  <span
                    className={cn(
                      "text-sm tabular-nums",
                      page.bounceRate > 40 ? "text-ember" : "text-ghost"
                    )}
                  >
                    {page.bounceRate}%
                  </span>
                </td>
                <td className="text-right px-5">
                  <span className="text-sm tabular-nums text-ghost font-mono">
                    {formatDuration(page.avgDuration)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
