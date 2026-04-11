"use client";

import { KPICards } from "@/components/dashboard/KPICards";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { TrafficSources } from "@/components/dashboard/TrafficSources";
import { TopPages } from "@/components/dashboard/TopPages";
import { RecentEvents } from "@/components/dashboard/RecentEvents";
import { GoalsConversions } from "@/components/dashboard/GoalsConversions";
import { GeoBreakdown } from "@/components/dashboard/GeoBreakdown";
import { UTMBreakdown } from "@/components/dashboard/UTMBreakdown";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { useDashboard } from "@/contexts/DashboardContext";
import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorBanner() {
  const { error, refresh } = useDashboard();
  if (!error) return null;

  return (
    <div className="rounded-xl border border-ember/20 bg-ember/[0.04] dark:bg-ember/[0.06] p-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-ember flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-ember">Failed to load analytics</p>
        <p className="text-xs text-ghost mt-0.5">{error}</p>
      </div>
      <button
        onClick={refresh}
        className="flex items-center gap-1.5 text-xs font-medium text-ember hover:text-ember/80 px-3 py-1.5 rounded-lg border border-ember/20 hover:bg-ember/[0.04] transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-ghost mt-1">
          Overview of your website analytics for the selected period.
        </p>
      </div>

      {/* Error state */}
      <ErrorBanner />

      {/* KPI Cards */}
      <KPICards />

      {/* Traffic Chart + Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <TrafficSources />
      </div>

      {/* Top Pages + Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <TopPages />
        <RecentEvents />
      </div>

      {/* Goals + Geography + UTMs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <GoalsConversions />
        <GeoBreakdown />
        <UTMBreakdown />
      </div>

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
}
