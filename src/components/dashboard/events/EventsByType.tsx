"use client";

import { cn } from "@/lib/utils";
import {
  Eye,
  MousePointerClick,
  UserPlus,
  FileText,
  ShoppingCart,
  Download,
} from "lucide-react";

interface EventType {
  type: string;
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  conversionRate: number;
}

const eventTypes: EventType[] = [
  {
    type: "pageview",
    label: "Pageview",
    count: 18240,
    icon: Eye,
    color: "#3B7BF8",
    bgColor: "bg-sapphire/[0.08]",
    conversionRate: 1.2,
  },
  {
    type: "click",
    label: "Click",
    count: 12380,
    icon: MousePointerClick,
    color: "#1AE5A0",
    bgColor: "bg-jade/[0.08]",
    conversionRate: 3.8,
  },
  {
    type: "signup",
    label: "Signup",
    count: 4210,
    icon: UserPlus,
    color: "#1AE5A0",
    bgColor: "bg-jade/[0.08]",
    conversionRate: 27.8,
  },
  {
    type: "form",
    label: "Form Submit",
    count: 3820,
    icon: FileText,
    color: "#F0A500",
    bgColor: "bg-gold/[0.08]",
    conversionRate: 15.4,
  },
  {
    type: "purchase",
    label: "Purchase",
    count: 2490,
    icon: ShoppingCart,
    color: "#1AE5A0",
    bgColor: "bg-jade/[0.08]",
    conversionRate: 100,
  },
  {
    type: "download",
    label: "Download",
    count: 2120,
    icon: Download,
    color: "#3B7BF8",
    bgColor: "bg-sapphire/[0.08]",
    conversionRate: 8.2,
  },
];

const totalEvents = eventTypes.reduce((sum, e) => sum + e.count, 0);

export function EventsByType() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Events by Type</h3>
          <p className="text-xs text-ghost mt-0.5">
            Distribution across {totalEvents.toLocaleString()} total events
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {eventTypes.map((evt) => {
          const pct = (evt.count / totalEvents) * 100;
          const Icon = evt.icon;

          return (
            <div
              key={evt.type}
              className="flex items-center gap-3 py-1.5 px-1 -mx-1 rounded-lg hover:bg-mist/30 dark:hover:bg-white/[0.02] transition-colors group"
            >
              {/* Icon */}
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", evt.bgColor)}>
                <Icon className="w-3.5 h-3.5" style={{ color: evt.color }} />
              </div>

              {/* Label */}
              <div className="w-24 flex-shrink-0">
                <span className="text-xs font-medium text-ink dark:text-white">{evt.label}</span>
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-mist/50 dark:bg-white/[0.02] rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-md transition-all duration-700 group-hover:brightness-110"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: evt.color,
                    opacity: 0.75,
                  }}
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white mix-blend-difference">
                  {pct.toFixed(1)}%
                </span>
              </div>

              {/* Count */}
              <div className="w-16 text-right flex-shrink-0">
                <span className="text-xs font-semibold text-ink dark:text-white tabular-nums">
                  {evt.count.toLocaleString()}
                </span>
              </div>

              {/* Conversion rate */}
              <div className="w-20 text-right flex-shrink-0 hidden sm:block">
                <span className="text-[11px] text-ghost tabular-nums">
                  {evt.conversionRate}% CVR
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {eventTypes.map((evt) => {
            const pct = (evt.count / totalEvents) * 100;
            return (
              <div
                key={evt.type}
                className="h-full rounded-full first:rounded-l-full last:rounded-r-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: evt.color,
                  opacity: 0.8,
                }}
                title={`${evt.label}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
