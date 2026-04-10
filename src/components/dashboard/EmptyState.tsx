"use client";

import { cn } from "@/lib/utils";
import { BarChart3, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = BarChart3,
  title = "No data yet",
  description = "Start collecting data by adding the tracking script to your website.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-mist dark:bg-white/[0.04] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ghost/40" />
      </div>
      <h3 className="text-sm font-semibold text-ink dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-ghost max-w-[280px] leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-xs font-medium rounded-lg bg-jade text-ink hover:bg-jade-hover transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
