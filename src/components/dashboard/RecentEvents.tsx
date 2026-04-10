"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, MousePointerClick, Eye, UserPlus, FileText, ShoppingCart, Download } from "lucide-react";

interface Event {
  id: string;
  type: "pageview" | "click" | "signup" | "form" | "purchase" | "download";
  label: string;
  page: string;
  timestamp: string;
}

const eventConfig = {
  pageview: { icon: Eye, color: "text-sapphire", bg: "bg-sapphire/[0.08]", label: "View" },
  click: { icon: MousePointerClick, color: "text-jade", bg: "bg-jade/[0.08]", label: "Click" },
  signup: { icon: UserPlus, color: "text-jade", bg: "bg-jade/[0.08]", label: "Signup" },
  form: { icon: FileText, color: "text-gold", bg: "bg-gold/[0.08]", label: "Form" },
  purchase: { icon: ShoppingCart, color: "text-jade", bg: "bg-jade/[0.08]", label: "Purchase" },
  download: { icon: Download, color: "text-sapphire", bg: "bg-sapphire/[0.08]", label: "Download" },
};

const events: Event[] = [
  { id: "1", type: "signup", label: "New user registered", page: "/pricing", timestamp: "2 min ago" },
  { id: "2", type: "purchase", label: "Pro plan purchased", page: "/checkout", timestamp: "5 min ago" },
  { id: "3", type: "pageview", label: "Page visited", page: "/features", timestamp: "8 min ago" },
  { id: "4", type: "click", label: "CTA button clicked", page: "/", timestamp: "12 min ago" },
  { id: "5", type: "form", label: "Contact form submitted", page: "/contact", timestamp: "15 min ago" },
  { id: "6", type: "download", label: "Whitepaper downloaded", page: "/resources", timestamp: "18 min ago" },
  { id: "7", type: "pageview", label: "Page visited", page: "/blog/privacy", timestamp: "22 min ago" },
  { id: "8", type: "signup", label: "New user registered", page: "/signup", timestamp: "25 min ago" },
  { id: "9", type: "click", label: "Pricing toggle clicked", page: "/pricing", timestamp: "28 min ago" },
  { id: "10", type: "purchase", label: "Starter plan purchased", page: "/checkout", timestamp: "31 min ago" },
];

export function RecentEvents() {
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
        {events.map((event) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-mist/50 dark:hover:bg-white/[0.02] transition-colors group"
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink dark:text-white truncate">{event.label}</span>
                  <span className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0",
                    config.bg, config.color
                  )}>
                    {config.label}
                  </span>
                </div>
                <span className="text-[11px] text-ghost font-mono">{event.page}</span>
              </div>
              <span className="text-[11px] text-ghost flex-shrink-0 tabular-nums">{event.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
