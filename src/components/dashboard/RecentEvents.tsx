"use client";

import { cn } from "@/lib/utils";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  ArrowUpRight,
  MousePointerClick,
  Eye,
  UserPlus,
  FileText,
  ShoppingCart,
  Download,
  Zap,
  Inbox,
} from "lucide-react";

const eventConfig: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  pageview: { icon: Eye, color: "text-sapphire", bg: "bg-sapphire/[0.08]" },
  click: { icon: MousePointerClick, color: "text-jade", bg: "bg-jade/[0.08]" },
  signup: { icon: UserPlus, color: "text-jade", bg: "bg-jade/[0.08]" },
  form_submit: { icon: FileText, color: "text-gold", bg: "bg-gold/[0.08]" },
  purchase: { icon: ShoppingCart, color: "text-jade", bg: "bg-jade/[0.08]" },
  download: { icon: Download, color: "text-sapphire", bg: "bg-sapphire/[0.08]" },
};

const defaultConfig = { icon: Zap, color: "text-gold", bg: "bg-gold/[0.08]" };

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

function EventsSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-24 h-4 mb-2 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          <div className="w-36 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="w-7 h-7 rounded-lg bg-mist dark:bg-white/[0.04] animate-pulse" />
            <div className="flex-1">
              <div className="w-32 h-3.5 mb-1 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
              <div className="w-20 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
            </div>
            <div className="w-12 h-3 rounded bg-mist dark:bg-white/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyEvents() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink dark:text-white">Recent Events</h3>
        <p className="text-xs text-ghost mt-0.5">Real-time event stream</p>
      </div>
      <div className="flex flex-col items-center justify-center py-10">
        <Inbox className="w-10 h-10 text-ghost/20 mb-3" />
        <p className="text-sm font-medium text-ghost/60">No events recorded</p>
        <p className="text-xs text-ghost/40 mt-1">Custom events will appear here</p>
      </div>
    </div>
  );
}

export function RecentEvents() {
  const { data, loading } = useDashboard();

  if (loading) return <EventsSkeleton />;
  if (!data || data.recentEvents.length === 0) return <EmptyEvents />;

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Recent Events</h3>
          <p className="text-xs text-ghost mt-0.5">Real-time event stream</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jade opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-jade" />
          </span>
          <button className="text-xs text-jade hover:text-jade-hover font-medium flex items-center gap-1 transition-colors">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {data.recentEvents.map((event) => {
          const config =
            eventConfig[event.eventName.toLowerCase()] ?? defaultConfig;
          const Icon = config.icon;
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-mist/50 dark:hover:bg-white/[0.02] transition-colors group"
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                  config.bg
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink dark:text-white truncate">
                    {event.eventName}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0",
                      config.bg,
                      config.color
                    )}
                  >
                    Event
                  </span>
                </div>
                <span className="text-[11px] text-ghost font-mono">
                  {event.pagePath}
                </span>
              </div>
              <span className="text-[11px] text-ghost flex-shrink-0 tabular-nums">
                {formatTimeAgo(event.occurredAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
