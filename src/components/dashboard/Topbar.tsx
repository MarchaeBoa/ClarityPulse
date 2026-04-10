"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Menu,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Bell,
  Calendar,
  Check,
} from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const projects = [
  { id: "1", name: "claritypulse.io", domain: "claritypulse.io", color: "bg-jade" },
  { id: "2", name: "docs.claritypulse.io", domain: "docs.claritypulse.io", color: "bg-sapphire" },
  { id: "3", name: "blog.claritypulse.io", domain: "blog.claritypulse.io", color: "bg-gold" },
];

const dateRanges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This month", value: "month" },
  { label: "This year", value: "year" },
];

function Dropdown({
  trigger,
  children,
  align = "left",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-2 z-50 min-w-[200px] py-1.5 rounded-xl border shadow-lg",
            "bg-white dark:bg-surface-3 border-black/[0.06] dark:border-white/[0.06]",
            "animate-fade-in",
            align === "right" ? "right-0" : "left-0"
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Topbar({ onMenuClick, dateRange, onDateRangeChange }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 px-4 md:px-6 border-b border-black/[0.04] dark:border-white/[0.06] bg-white/60 dark:bg-ink/60 backdrop-blur-xl">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project selector */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors">
              <div className={cn("w-2 h-2 rounded-full", selectedProject.color)} />
              <span className="text-sm font-medium text-ink dark:text-white hidden sm:block">
                {selectedProject.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-ghost" />
            </button>
          }
        >
          <div className="px-2 pb-1.5 mb-1 border-b border-black/[0.04] dark:border-white/[0.06]">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ghost px-2 py-1">
              Projects
            </p>
          </div>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors",
                "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                selectedProject.id === p.id
                  ? "text-ink dark:text-white"
                  : "text-ghost"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", p.color)} />
              <span className="flex-1 text-left">{p.name}</span>
              {selectedProject.id === p.id && (
                <Check className="w-3.5 h-3.5 text-jade" />
              )}
            </button>
          ))}
        </Dropdown>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="relative hidden md:block">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-mist dark:bg-white/[0.04] rounded-lg px-3 py-1.5 border border-black/[0.06] dark:border-white/[0.06]">
              <Search className="w-4 h-4 text-ghost" />
              <input
                autoFocus
                type="text"
                placeholder="Search pages, events..."
                className="bg-transparent text-sm text-ink dark:text-white placeholder:text-ghost outline-none w-48"
                onBlur={() => setSearchOpen(false)}
              />
              <kbd className="text-[10px] text-ghost/60 bg-white/60 dark:bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">
                ESC
              </kbd>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden lg:block">Search...</span>
              <kbd className="text-[10px] text-ghost/40 bg-mist dark:bg-white/[0.04] px-1.5 py-0.5 rounded font-mono hidden lg:block">
                /
              </kbd>
            </button>
          )}
        </div>

        {/* Date Range */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors border border-black/[0.06] dark:border-white/[0.06]">
              <Calendar className="w-3.5 h-3.5 text-ghost" />
              <span className="text-sm font-medium text-ink dark:text-white hidden sm:block">
                {dateRanges.find((r) => r.value === dateRange)?.label ?? "Last 30 days"}
              </span>
              <ChevronDown className="w-3 h-3 text-ghost" />
            </button>
          }
          align="right"
        >
          {dateRanges.map((r) => (
            <button
              key={r.value}
              onClick={() => onDateRangeChange(r.value)}
              className={cn(
                "flex items-center justify-between gap-4 w-full px-3 py-2 text-sm transition-colors",
                "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                dateRange === r.value
                  ? "text-jade font-medium"
                  : "text-ink/70 dark:text-ghost"
              )}
            >
              <span>{r.label}</span>
              {dateRange === r.value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </Dropdown>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-ghost hover:text-ink dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ember rounded-full" />
        </button>

        {/* Avatar */}
        <button className="ml-1 w-8 h-8 rounded-full bg-gradient-to-br from-jade to-sapphire flex items-center justify-center text-white text-xs font-bold">
          M
        </button>
      </div>
    </header>
  );
}
