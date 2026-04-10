"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Download, Plus } from "lucide-react";
import { EventsKPICards } from "@/components/dashboard/events/EventsKPICards";
import { EventsFilterBar, type EventsFilters } from "@/components/dashboard/events/EventsFilterBar";
import { EventPerformanceChart } from "@/components/dashboard/events/EventPerformanceChart";
import { ConversionRateChart } from "@/components/dashboard/events/ConversionRateChart";
import { ConversionFunnel } from "@/components/dashboard/events/ConversionFunnel";
import { GoalsManager } from "@/components/dashboard/events/GoalsManager";
import { EventsByType } from "@/components/dashboard/events/EventsByType";
import { EventsTable } from "@/components/dashboard/events/EventsTable";

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-mist dark:bg-white/[0.04] animate-pulse",
        className
      )}
    />
  );
}

function EventsPageSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Bone className="w-48 h-7 mb-2" />
          <Bone className="w-72 h-4" />
        </div>
        <div className="flex gap-2">
          <Bone className="w-28 h-8 rounded-lg" />
          <Bone className="w-28 h-8 rounded-lg" />
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] px-4 py-3">
        <div className="flex gap-2.5">
          <Bone className="w-28 h-7 rounded-lg" />
          <Bone className="w-px h-5 my-auto" />
          <Bone className="w-24 h-7 rounded-lg" />
          <Bone className="w-20 h-7 rounded-lg" />
          <Bone className="w-20 h-7 rounded-lg" />
          <Bone className="w-px h-5 my-auto" />
          <Bone className="flex-1 max-w-[200px] h-7 rounded-lg" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4">
            <div className="flex items-start justify-between mb-3">
              <Bone className="w-8 h-8 rounded-lg" />
              <Bone className="w-20 h-8" />
            </div>
            <Bone className="w-24 h-7 mb-2" />
            <div className="flex items-center justify-between">
              <Bone className="w-20 h-3" />
              <Bone className="w-12 h-3" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <Bone className="w-32 h-4 mb-2" />
              <Bone className="w-44 h-3" />
            </div>
          </div>
          <div className="flex gap-5 mb-4">
            <Bone className="w-16 h-3" />
            <Bone className="w-16 h-3" />
          </div>
          <Bone className="w-full h-[280px] rounded-lg" />
        </div>
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
          <Bone className="w-28 h-4 mb-2" />
          <Bone className="w-36 h-3 mb-4" />
          <Bone className="w-20 h-8 mb-1" />
          <Bone className="w-16 h-3 mb-4" />
          <Bone className="w-full h-[186px] rounded-lg" />
        </div>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
          <Bone className="w-32 h-4 mb-2" />
          <Bone className="w-48 h-3 mb-5" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-center gap-3">
                <Bone className="w-[72px] h-3" />
                <Bone className="flex-1 h-9 rounded-lg" />
                <Bone className="w-10 h-3" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Bone className="w-16 h-4 mb-2" />
              <Bone className="w-36 h-3" />
            </div>
            <Bone className="w-20 h-7 rounded-lg" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <Bone className="w-28 h-3" />
                <Bone className="w-20 h-3" />
              </div>
              <Bone className="w-full h-1.5 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Events by type */}
      <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
        <Bone className="w-28 h-4 mb-2" />
        <Bone className="w-48 h-3 mb-5" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <Bone className="w-7 h-7 rounded-lg" />
            <Bone className="w-20 h-3" />
            <Bone className="flex-1 h-6 rounded-md" />
            <Bone className="w-12 h-3" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Bone className="w-20 h-4 mb-2" />
            <Bone className="w-36 h-3" />
          </div>
          <Bone className="w-12 h-4" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 mb-3">
            <Bone className="w-7 h-7 rounded-lg" />
            <Bone className="flex-1 h-4" />
            <Bone className="w-14 h-4" />
            <Bone className="w-20 h-4" />
            <Bone className="w-14 h-4" />
            <Bone className="w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export utility                                                      */
/* ------------------------------------------------------------------ */

function exportToCSV() {
  const headers = ["Event", "Type", "Page", "Source", "Medium", "Campaign", "Device", "Country", "Value", "Timestamp"];
  const rows = [
    ["New user registered", "signup", "/pricing", "google", "organic", "-", "desktop", "US", "", "2 min ago"],
    ["Pro plan purchased", "purchase", "/checkout", "direct", "-", "-", "desktop", "UK", "$49", "5 min ago"],
    ["Page visited", "pageview", "/features", "google", "organic", "-", "mobile", "DE", "", "8 min ago"],
    ["CTA button clicked", "click", "/", "twitter", "social", "launch_2024", "mobile", "US", "", "12 min ago"],
    ["Contact form submitted", "form", "/contact", "google", "cpc", "brand_q1", "desktop", "FR", "", "15 min ago"],
    ["Whitepaper downloaded", "download", "/resources", "linkedin", "social", "content_q1", "desktop", "US", "", "18 min ago"],
    ["Page visited", "pageview", "/blog/privacy", "google", "organic", "-", "tablet", "BR", "", "22 min ago"],
    ["New user registered", "signup", "/signup", "referral", "partner", "partner_abc", "desktop", "CA", "", "25 min ago"],
    ["Pricing toggle clicked", "click", "/pricing", "google", "cpc", "pricing_q1", "mobile", "US", "", "28 min ago"],
    ["Starter plan purchased", "purchase", "/checkout", "email", "newsletter", "promo_march", "desktop", "US", "$19", "31 min ago"],
    ["Newsletter subscribed", "form", "/blog", "google", "organic", "-", "mobile", "IN", "", "34 min ago"],
    ["Page visited", "pageview", "/about", "direct", "-", "-", "desktop", "AU", "", "37 min ago"],
  ];

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `claritypulse-events-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventsFilters>({
    period: "30D",
    eventTypes: [],
    sources: [],
    devices: [],
    search: "",
  });

  const scrollToGoals = useCallback(() => {
    document.getElementById("goals-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <EventsPageSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-ink dark:text-white">
            Events & Conversions
          </h1>
          <p className="text-sm text-ghost mt-1">
            Track user interactions and optimize your conversion pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToGoals}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all",
              "bg-jade/[0.08] text-jade hover:bg-jade/[0.12]"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            Create Goal
          </button>
          <button
            onClick={exportToCSV}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-all",
              "border border-black/[0.06] dark:border-white/[0.06]",
              "text-ink dark:text-white hover:bg-mist/50 dark:hover:bg-white/[0.04]"
            )}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <EventsFilterBar filters={filters} onFiltersChange={setFilters} />

      {/* KPI Cards */}
      <EventsKPICards />

      {/* Charts: Performance + Conversion Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <EventPerformanceChart period={filters.period} />
        </div>
        <ConversionRateChart period={filters.period} />
      </div>

      {/* Funnel + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ConversionFunnel />
        <div id="goals-section">
          <GoalsManager />
        </div>
      </div>

      {/* Events by Type */}
      <EventsByType />

      {/* Events Table */}
      <EventsTable search={filters.search} />
    </div>
  );
}
