"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Zap,
  ArrowUpRight,
  Brain,
} from "lucide-react";

interface Insight {
  id: string;
  type: "trend" | "alert" | "opportunity" | "achievement";
  title: string;
  description: string;
  metric?: string;
}

const typeConfig = {
  trend: {
    icon: TrendingUp,
    color: "text-sapphire",
    bg: "bg-sapphire/[0.08]",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-ember",
    bg: "bg-ember/[0.08]",
  },
  opportunity: {
    icon: Lightbulb,
    color: "text-gold",
    bg: "bg-gold/[0.08]",
  },
  achievement: {
    icon: Zap,
    color: "text-jade",
    bg: "bg-jade/[0.08]",
  },
};

function pctChange(cur: number, prev: number): number {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
}

function InsightsSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-mist dark:bg-white/[0.04] animate-pulse" />
        <div>
          <div className="w-20 h-4 mb-1 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-36 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-black/[0.04] dark:border-white/[0.04]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-mist dark:bg-white/[0.04] animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="w-32 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
                <div className="w-full h-3 mb-1 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
                <div className="w-3/4 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyInsights() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-jade/20 to-sapphire/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-jade" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">AI Insights</h3>
          <p className="text-xs text-ghost mt-0.5">Intelligent analysis of your data</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center py-8">
        <Brain className="w-10 h-10 text-ghost/20 mb-3" />
        <p className="text-sm font-medium text-ghost/60">Not enough data for insights</p>
        <p className="text-xs text-ghost/40 mt-1">
          Insights will be generated as more data is collected
        </p>
      </div>
    </div>
  );
}

export function AIInsights() {
  const { data, loading } = useDashboard();

  // Generate insights dynamically from real data
  const insights = useMemo<Insight[]>(() => {
    if (!data) return [];

    const result: Insight[] = [];
    const { kpis, topPages, trafficSources, geoBreakdown } = data;

    // Traffic trend insight
    const visitorChange = pctChange(kpis.uniqueVisitors, kpis.prevUniqueVisitors);
    if (kpis.uniqueVisitors > 0) {
      if (visitorChange > 10) {
        result.push({
          id: "traffic-up",
          type: "achievement",
          title: "Traffic is growing",
          description: `You reached ${kpis.uniqueVisitors.toLocaleString()} unique visitors this period, up ${visitorChange}% from the previous period. Keep the momentum going!`,
          metric: `+${visitorChange}%`,
        });
      } else if (visitorChange < -10) {
        result.push({
          id: "traffic-down",
          type: "alert",
          title: "Traffic declining",
          description: `Unique visitors dropped ${Math.abs(visitorChange)}% compared to the previous period. Consider reviewing your content strategy and traffic sources.`,
          metric: `${visitorChange}%`,
        });
      } else {
        result.push({
          id: "traffic-stable",
          type: "trend",
          title: "Stable traffic",
          description: `You had ${kpis.uniqueVisitors.toLocaleString()} unique visitors this period with a ${visitorChange >= 0 ? "+" : ""}${visitorChange}% change. Traffic is holding steady.`,
          metric: `${kpis.uniqueVisitors.toLocaleString()} visitors`,
        });
      }
    }

    // Bounce rate insight
    if (kpis.bounceRate > 50) {
      result.push({
        id: "bounce-high",
        type: "alert",
        title: "High bounce rate detected",
        description: `Your bounce rate is ${kpis.bounceRate.toFixed(1)}%, which is above the recommended 40% threshold. Consider improving page load speed and content relevance.`,
        metric: `${kpis.bounceRate.toFixed(1)}% bounce`,
      });
    }

    // Top page opportunity
    if (topPages.length > 0) {
      const best = topPages[0];
      result.push({
        id: "top-page",
        type: "opportunity",
        title: `"${best.path}" is your top page`,
        description: `With ${best.views.toLocaleString()} views and ${best.uniques.toLocaleString()} unique visitors, this page drives the most traffic. Consider adding stronger CTAs to capture more conversions.`,
        metric: `${best.views.toLocaleString()} views`,
      });
    }

    // Traffic source insight
    if (trafficSources.length > 0) {
      const topSource = trafficSources[0];
      result.push({
        id: "top-source",
        type: "trend",
        title: `${topSource.source} leads traffic`,
        description: `${topSource.source} accounts for ${topSource.percentage}% of your traffic (${topSource.visitors.toLocaleString()} visitors). ${topSource.source === "Direct" ? "Strong brand awareness!" : "Consider investing more in this channel."}`,
        metric: `${topSource.percentage}%`,
      });
    }

    // Geo insight
    if (geoBreakdown.length >= 2) {
      const topCountry = geoBreakdown[0];
      result.push({
        id: "geo-top",
        type: "trend",
        title: `Most visitors from ${topCountry.countryName}`,
        description: `${topCountry.countryName} accounts for ${topCountry.percentage}% of your visitors. You have traffic from ${data.totalCountries} countries total.`,
        metric: `${topCountry.percentage}%`,
      });
    }

    return result.slice(0, 4);
  }, [data]);

  if (loading) return <InsightsSkeleton />;
  if (!data || insights.length === 0) return <EmptyInsights />;

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-jade/20 to-sapphire/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-jade" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink dark:text-white">AI Insights</h3>
            <p className="text-xs text-ghost mt-0.5">Intelligent analysis of your data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ghost bg-mist dark:bg-white/[0.04] px-2 py-0.5 rounded-full">
            Auto-generated
          </span>
          <button className="text-xs text-jade hover:text-jade-hover font-medium flex items-center gap-1 transition-colors">
            All insights <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className={cn(
                "group p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                "border-black/[0.04] dark:border-white/[0.04]",
                "hover:border-black/[0.08] dark:hover:border-white/[0.08]",
                "bg-mist/30 dark:bg-white/[0.015]",
                "hover:bg-mist/60 dark:hover:bg-white/[0.03]"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-ink dark:text-white truncate">
                      {insight.title}
                    </h4>
                    {insight.metric && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0",
                          config.bg,
                          config.color
                        )}
                      >
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ghost leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
