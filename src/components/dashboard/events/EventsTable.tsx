"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Eye,
  MousePointerClick,
  UserPlus,
  FileText,
  ShoppingCart,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

interface EventRow {
  id: string;
  type: "pageview" | "click" | "signup" | "form" | "purchase" | "download";
  label: string;
  page: string;
  source: string;
  medium: string;
  campaign: string;
  device: "desktop" | "mobile" | "tablet";
  country: string;
  value: number | null;
  timestamp: string;
  sessionDuration: string;
  referrer: string;
}

const eventConfig = {
  pageview: { icon: Eye, color: "text-sapphire", bg: "bg-sapphire/[0.08]", label: "View" },
  click: { icon: MousePointerClick, color: "text-jade", bg: "bg-jade/[0.08]", label: "Click" },
  signup: { icon: UserPlus, color: "text-jade", bg: "bg-jade/[0.08]", label: "Signup" },
  form: { icon: FileText, color: "text-gold", bg: "bg-gold/[0.08]", label: "Form" },
  purchase: { icon: ShoppingCart, color: "text-jade", bg: "bg-jade/[0.08]", label: "Purchase" },
  download: { icon: Download, color: "text-sapphire", bg: "bg-sapphire/[0.08]", label: "Download" },
};

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const mockEvents: EventRow[] = [
  { id: "1", type: "signup", label: "New user registered", page: "/pricing", source: "google", medium: "organic", campaign: "-", device: "desktop", country: "US", value: null, timestamp: "2 min ago", sessionDuration: "4m 12s", referrer: "google.com" },
  { id: "2", type: "purchase", label: "Pro plan purchased", page: "/checkout", source: "direct", medium: "-", campaign: "-", device: "desktop", country: "UK", value: 49, timestamp: "5 min ago", sessionDuration: "12m 34s", referrer: "-" },
  { id: "3", type: "pageview", label: "Page visited", page: "/features", source: "google", medium: "organic", campaign: "-", device: "mobile", country: "DE", value: null, timestamp: "8 min ago", sessionDuration: "1m 08s", referrer: "google.de" },
  { id: "4", type: "click", label: "CTA button clicked", page: "/", source: "twitter", medium: "social", campaign: "launch_2024", device: "mobile", country: "US", value: null, timestamp: "12 min ago", sessionDuration: "2m 45s", referrer: "t.co" },
  { id: "5", type: "form", label: "Contact form submitted", page: "/contact", source: "google", medium: "cpc", campaign: "brand_q1", device: "desktop", country: "FR", value: null, timestamp: "15 min ago", sessionDuration: "3m 22s", referrer: "google.fr" },
  { id: "6", type: "download", label: "Whitepaper downloaded", page: "/resources", source: "linkedin", medium: "social", campaign: "content_q1", device: "desktop", country: "US", value: null, timestamp: "18 min ago", sessionDuration: "5m 10s", referrer: "linkedin.com" },
  { id: "7", type: "pageview", label: "Page visited", page: "/blog/privacy", source: "google", medium: "organic", campaign: "-", device: "tablet", country: "BR", value: null, timestamp: "22 min ago", sessionDuration: "0m 42s", referrer: "google.com.br" },
  { id: "8", type: "signup", label: "New user registered", page: "/signup", source: "referral", medium: "partner", campaign: "partner_abc", device: "desktop", country: "CA", value: null, timestamp: "25 min ago", sessionDuration: "6m 30s", referrer: "partner.com" },
  { id: "9", type: "click", label: "Pricing toggle clicked", page: "/pricing", source: "google", medium: "cpc", campaign: "pricing_q1", device: "mobile", country: "US", value: null, timestamp: "28 min ago", sessionDuration: "1m 55s", referrer: "google.com" },
  { id: "10", type: "purchase", label: "Starter plan purchased", page: "/checkout", source: "email", medium: "newsletter", campaign: "promo_march", device: "desktop", country: "US", value: 19, timestamp: "31 min ago", sessionDuration: "8m 12s", referrer: "mail.google.com" },
  { id: "11", type: "form", label: "Newsletter subscribed", page: "/blog", source: "google", medium: "organic", campaign: "-", device: "mobile", country: "IN", value: null, timestamp: "34 min ago", sessionDuration: "2m 20s", referrer: "google.co.in" },
  { id: "12", type: "pageview", label: "Page visited", page: "/about", source: "direct", medium: "-", campaign: "-", device: "desktop", country: "AU", value: null, timestamp: "37 min ago", sessionDuration: "1m 15s", referrer: "-" },
];

interface EventsTableProps {
  search: string;
}

export function EventsTable({ search }: EventsTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"timestamp" | "type" | "source">("timestamp");
  const perPage = 8;

  const filtered = mockEvents.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.label.toLowerCase().includes(q) ||
      e.page.toLowerCase().includes(q) ||
      e.source.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Event Log</h3>
          <p className="text-xs text-ghost mt-0.5">
            Detailed view of {filtered.length} events
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-jade opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-jade" />
          </span>
          <span className="text-[11px] text-ghost">Live</span>
        </div>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1fr_72px_120px_80px_60px_80px] gap-3 px-2 pb-2 border-b border-black/[0.04] dark:border-white/[0.04]">
        {[
          { label: "Event", key: "timestamp" as const },
          { label: "Type", key: "type" as const },
          { label: "Page", key: "timestamp" as const },
          { label: "Source", key: "source" as const },
          { label: "Device", key: "timestamp" as const },
          { label: "Time", key: "timestamp" as const },
        ].map((col) => (
          <button
            key={col.label}
            onClick={() => setSortBy(col.key)}
            className={cn(
              "flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider transition-colors text-left",
              sortBy === col.key ? "text-ink dark:text-white" : "text-ghost/60 hover:text-ghost"
            )}
          >
            {col.label}
            <ArrowUpDown className="w-2.5 h-2.5" />
          </button>
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
        {paged.map((event) => {
          const config = eventConfig[event.type];
          const Icon = config.icon;
          const DeviceIcon = deviceIcons[event.device];
          const isExpanded = expandedRow === event.id;

          return (
            <div key={event.id}>
              <button
                onClick={() => setExpandedRow(isExpanded ? null : event.id)}
                className={cn(
                  "w-full grid grid-cols-1 md:grid-cols-[1fr_72px_120px_80px_60px_80px] gap-2 md:gap-3 items-center py-2.5 px-2 -mx-0 rounded-lg transition-colors text-left",
                  "hover:bg-mist/50 dark:hover:bg-white/[0.02]",
                  isExpanded && "bg-mist/30 dark:bg-white/[0.01]"
                )}
              >
                {/* Event label */}
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
                    <Icon className={cn("w-3.5 h-3.5", config.color)} />
                  </div>
                  <span className="text-sm text-ink dark:text-white truncate">{event.label}</span>
                  <ChevronDown
                    className={cn(
                      "w-3 h-3 text-ghost/40 flex-shrink-0 transition-transform md:hidden",
                      isExpanded && "rotate-180"
                    )}
                  />
                </div>

                {/* Type badge */}
                <div className="hidden md:block">
                  <span className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                    config.bg, config.color
                  )}>
                    {config.label}
                  </span>
                </div>

                {/* Page */}
                <span className="text-[11px] text-ghost font-mono truncate hidden md:block">
                  {event.page}
                </span>

                {/* Source */}
                <span className="text-[11px] text-ghost truncate hidden md:block">{event.source}</span>

                {/* Device */}
                <div className="hidden md:flex items-center justify-center">
                  <DeviceIcon className="w-3.5 h-3.5 text-ghost/60" />
                </div>

                {/* Timestamp */}
                <span className="text-[11px] text-ghost tabular-nums hidden md:block text-right">
                  {event.timestamp}
                </span>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-2 pb-3 ml-9 md:ml-10 animate-fade-in">
                  <div className="p-3 rounded-lg bg-mist/30 dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.03]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <DetailItem label="Page" value={event.page} mono />
                      <DetailItem label="Source / Medium" value={`${event.source} / ${event.medium}`} />
                      <DetailItem label="Campaign" value={event.campaign} />
                      <DetailItem label="Country" value={event.country} />
                      <DetailItem label="Device" value={event.device} />
                      <DetailItem label="Session Duration" value={event.sessionDuration} />
                      <DetailItem label="Referrer" value={event.referrer} />
                      {event.value !== null && (
                        <DetailItem label="Value" value={`$${event.value}`} highlight />
                      )}
                    </div>

                    {/* User journey */}
                    <div className="mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-ghost/50 mb-2">
                        User Journey
                      </p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {[event.referrer !== "-" ? event.referrer : "Direct", "/", event.page].map((step, i) => (
                          <span key={i} className="flex items-center gap-1">
                            {i > 0 && <ExternalLink className="w-2.5 h-2.5 text-ghost/30" />}
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-surface border border-black/[0.04] dark:border-white/[0.06] text-ink dark:text-white font-mono">
                              {step}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
          <span className="text-[11px] text-ghost">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-ghost transition-colors",
                page === 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-mist dark:hover:bg-white/[0.04] hover:text-ink dark:hover:text-white"
              )}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                  p === page
                    ? "bg-jade/[0.1] text-jade"
                    : "text-ghost hover:bg-mist dark:hover:bg-white/[0.04] hover:text-ink dark:hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center text-ghost transition-colors",
                page === totalPages
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-mist dark:hover:bg-white/[0.04] hover:text-ink dark:hover:text-white"
              )}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-ghost/50 mb-0.5">
        {label}
      </p>
      <p
        className={cn(
          "text-xs truncate",
          mono && "font-mono",
          highlight ? "font-semibold text-jade" : "text-ink dark:text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}
