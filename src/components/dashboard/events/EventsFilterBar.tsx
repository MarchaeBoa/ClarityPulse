"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronDown,
  X,
  Monitor,
  Smartphone,
  Tablet,
  Filter,
} from "lucide-react";

const periods = ["7D", "30D", "90D"] as const;

const eventTypes = [
  { value: "pageview", label: "Pageview" },
  { value: "click", label: "Click" },
  { value: "signup", label: "Signup" },
  { value: "form", label: "Form" },
  { value: "purchase", label: "Purchase" },
  { value: "download", label: "Download" },
] as const;

const sources = [
  { value: "direct", label: "Direct" },
  { value: "organic", label: "Organic Search" },
  { value: "social", label: "Social" },
  { value: "referral", label: "Referral" },
  { value: "email", label: "Email" },
  { value: "paid", label: "Paid" },
] as const;

const devices = [
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "tablet", label: "Tablet", icon: Tablet },
] as const;

interface FilterDropdownProps {
  label: string;
  options: readonly { value: string; label: string; icon?: React.ElementType }[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterDropdown({ label, options, selected, onToggle }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150",
          "border",
          selected.length > 0
            ? "bg-jade/[0.06] border-jade/20 text-jade dark:text-jade"
            : "bg-white dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.06] text-ink dark:text-white hover:border-black/[0.12] dark:hover:border-white/[0.12]"
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-jade text-white text-[10px] font-bold flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 z-20 w-48 py-1.5 rounded-xl border bg-white dark:bg-ink-2 border-black/[0.06] dark:border-white/[0.08] shadow-xl">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => onToggle(opt.value)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors",
                    "hover:bg-mist/50 dark:hover:bg-white/[0.04]",
                    isSelected ? "text-jade font-medium" : "text-ink dark:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected
                        ? "bg-jade border-jade"
                        : "border-ghost/30 dark:border-white/20"
                    )}
                  >
                    {isSelected && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {Icon && <Icon className="w-3.5 h-3.5 text-ghost" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export interface EventsFilters {
  period: (typeof periods)[number];
  eventTypes: string[];
  sources: string[];
  devices: string[];
  search: string;
}

interface EventsFilterBarProps {
  filters: EventsFilters;
  onFiltersChange: (filters: EventsFilters) => void;
}

export function EventsFilterBar({ filters, onFiltersChange }: EventsFilterBarProps) {
  const update = (partial: Partial<EventsFilters>) =>
    onFiltersChange({ ...filters, ...partial });

  const toggleFilter = (key: "eventTypes" | "sources" | "devices", value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update({ [key]: next });
  };

  const activeFilterCount =
    filters.eventTypes.length + filters.sources.length + filters.devices.length;

  const clearAll = () =>
    onFiltersChange({
      period: filters.period,
      eventTypes: [],
      sources: [],
      devices: [],
      search: "",
    });

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] px-4 py-3">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Period selector */}
        <div className="flex items-center bg-mist dark:bg-white/[0.04] rounded-lg p-0.5">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => update({ period: p })}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                filters.period === p
                  ? "bg-white dark:bg-white/[0.08] text-ink dark:text-white shadow-sm"
                  : "text-ghost hover:text-ink dark:hover:text-white"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-black/[0.06] dark:bg-white/[0.06] hidden sm:block" />

        {/* Filter dropdowns */}
        <FilterDropdown
          label="Event Type"
          options={eventTypes}
          selected={filters.eventTypes}
          onToggle={(v) => toggleFilter("eventTypes", v)}
        />
        <FilterDropdown
          label="Source"
          options={sources}
          selected={filters.sources}
          onToggle={(v) => toggleFilter("sources", v)}
        />
        <FilterDropdown
          label="Device"
          options={devices}
          selected={filters.devices}
          onToggle={(v) => toggleFilter("devices", v)}
        />

        <div className="w-px h-5 bg-black/[0.06] dark:bg-white/[0.06] hidden sm:block" />

        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ghost" />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className={cn(
              "w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-colors",
              "bg-transparent border-black/[0.06] dark:border-white/[0.06]",
              "text-ink dark:text-white placeholder:text-ghost/60",
              "focus:outline-none focus:border-jade/40 focus:ring-1 focus:ring-jade/20"
            )}
          />
        </div>

        {/* Active filter indicator + clear */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-ember hover:text-ember font-medium rounded-lg hover:bg-ember/[0.06] transition-colors"
          >
            <Filter className="w-3 h-3" />
            Clear {activeFilterCount} filter{activeFilterCount !== 1 && "s"}
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
