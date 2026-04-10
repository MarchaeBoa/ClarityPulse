"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Zap,
} from "lucide-react";

interface Insight {
  id: string;
  type: "trend" | "alert" | "opportunity" | "achievement";
  title: string;
  description: string;
  metric?: string;
  impact: "high" | "medium" | "low";
}

const insights: Insight[] = [
  {
    id: "1",
    type: "trend",
    title: "Organic traffic surging",
    description: "Organic search traffic increased 23% this week, primarily driven by your blog content. The article \"Privacy Analytics Guide\" is ranking #3 for key terms.",
    metric: "+23% organic",
    impact: "high",
  },
  {
    id: "2",
    type: "opportunity",
    title: "High-converting page detected",
    description: "Your /pricing page has an 8.4% conversion rate, significantly above the 3.2% site average. Consider driving more traffic to this page through internal links.",
    metric: "8.4% conv. rate",
    impact: "high",
  },
  {
    id: "3",
    type: "alert",
    title: "Mobile bounce rate increasing",
    description: "Bounce rate on mobile devices is 15% higher than desktop (52% vs 37%). Consider optimizing page load speed and mobile layout for better engagement.",
    metric: "+15% mobile bounce",
    impact: "medium",
  },
  {
    id: "4",
    type: "achievement",
    title: "New traffic record",
    description: "You hit 24,521 unique visitors this month — a new all-time high. This is 12.5% more than last month. Keep the momentum going!",
    metric: "24.5k visitors",
    impact: "high",
  },
];

const typeConfig = {
  trend: {
    icon: TrendingUp,
    color: "text-sapphire",
    bg: "bg-sapphire/[0.08]",
    border: "border-sapphire/20",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-ember",
    bg: "bg-ember/[0.08]",
    border: "border-ember/20",
  },
  opportunity: {
    icon: Lightbulb,
    color: "text-gold",
    bg: "bg-gold/[0.08]",
    border: "border-gold/20",
  },
  achievement: {
    icon: Zap,
    color: "text-jade",
    bg: "bg-jade/[0.08]",
    border: "border-jade/20",
  },
};

export function AIInsights() {
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
            Updated 5 min ago
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
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-ink dark:text-white truncate">
                      {insight.title}
                    </h4>
                    {insight.metric && (
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0",
                        config.bg, config.color
                      )}>
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ghost leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
