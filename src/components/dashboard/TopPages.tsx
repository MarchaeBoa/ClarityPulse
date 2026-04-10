"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

const pages = [
  { path: "/", title: "Homepage", views: 12480, uniques: 8240, bounce: 38.2, duration: "2:45", change: 8.5 },
  { path: "/pricing", title: "Pricing", views: 8340, uniques: 6120, bounce: 25.1, duration: "4:12", change: 15.3 },
  { path: "/features", title: "Features", views: 6215, uniques: 4880, bounce: 32.4, duration: "3:38", change: 5.2 },
  { path: "/blog/privacy-analytics", title: "Privacy Analytics Guide", views: 4890, uniques: 3920, bounce: 28.6, duration: "5:20", change: 42.1 },
  { path: "/docs/getting-started", title: "Getting Started", views: 3650, uniques: 2840, bounce: 22.8, duration: "6:05", change: -2.4 },
  { path: "/integrations", title: "Integrations", views: 2840, uniques: 2100, bounce: 35.6, duration: "3:15", change: 11.7 },
  { path: "/blog/ga4-alternative", title: "GA4 Alternative", views: 2210, uniques: 1850, bounce: 30.2, duration: "4:48", change: -5.1 },
  { path: "/about", title: "About Us", views: 1920, uniques: 1540, bounce: 42.8, duration: "2:22", change: 3.8 },
];

export function TopPages() {
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
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
              {["Page", "Views", "Uniques", "Bounce", "Duration", "Trend"].map((h) => (
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
            {pages.map((page, i) => (
              <tr
                key={page.path}
                className="group border-b border-black/[0.02] dark:border-white/[0.02] last:border-0 hover:bg-mist/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-ink dark:text-white truncate max-w-[200px]">
                      {page.title}
                    </span>
                    <span className="text-[11px] text-ghost font-mono truncate max-w-[200px]">
                      {page.path}
                    </span>
                  </div>
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
                  <span className={cn(
                    "text-sm tabular-nums",
                    page.bounce > 40 ? "text-ember" : "text-ghost"
                  )}>
                    {page.bounce}%
                  </span>
                </td>
                <td className="text-right px-5">
                  <span className="text-sm tabular-nums text-ghost font-mono">
                    {page.duration}
                  </span>
                </td>
                <td className="text-right px-5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-semibold",
                      page.change > 0 ? "text-jade" : "text-ember"
                    )}
                  >
                    {page.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(page.change)}%
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
