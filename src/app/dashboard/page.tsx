"use client";

import { useState, useEffect } from "react";
import { KPICards } from "@/components/dashboard/KPICards";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { TrafficSources } from "@/components/dashboard/TrafficSources";
import { TopPages } from "@/components/dashboard/TopPages";
import { RecentEvents } from "@/components/dashboard/RecentEvents";
import { GoalsConversions } from "@/components/dashboard/GoalsConversions";
import { GeoBreakdown } from "@/components/dashboard/GeoBreakdown";
import { UTMBreakdown } from "@/components/dashboard/UTMBreakdown";
import { AIInsights } from "@/components/dashboard/AIInsights";
import {
  KPISkeleton,
  ChartSkeleton,
  SourcesSkeleton,
  TableSkeleton,
  CardSkeleton,
  InsightsSkeleton,
} from "@/components/dashboard/LoadingSkeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <KPISkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <SourcesSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <TableSkeleton />
          <TableSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <InsightsSkeleton />
      </div>
    );
  }

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
