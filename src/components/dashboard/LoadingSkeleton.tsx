"use client";

import { cn } from "@/lib/utils";

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

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-4"
        >
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
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Bone className="w-28 h-4 mb-2" />
          <Bone className="w-40 h-3" />
        </div>
        <Bone className="w-28 h-7 rounded-lg" />
      </div>
      <div className="flex items-center gap-5 mb-4">
        <Bone className="w-16 h-3" />
        <Bone className="w-16 h-3" />
      </div>
      <Bone className="w-full h-[280px] rounded-lg" />
    </div>
  );
}

export function SourcesSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <Bone className="w-28 h-4 mb-2" />
      <Bone className="w-40 h-3 mb-6" />
      <Bone className="w-[180px] h-[180px] rounded-full mx-auto mb-4" />
      <div className="space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Bone className="w-2 h-2 rounded-full" />
            <Bone className="flex-1 h-3" />
            <Bone className="w-8 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Bone className="w-24 h-4 mb-2" />
          <Bone className="w-36 h-3" />
        </div>
        <Bone className="w-16 h-4" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Bone className="flex-1 h-4" />
            <Bone className="w-12 h-4" />
            <Bone className="w-10 h-4" />
            <Bone className="w-10 h-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Bone className="w-28 h-4 mb-2" />
          <Bone className="w-40 h-3" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <Bone className="w-28 h-3" />
              <Bone className="w-16 h-3" />
            </div>
            <Bone className="w-full h-1.5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center gap-2.5 mb-5">
        <Bone className="w-8 h-8 rounded-lg" />
        <div>
          <Bone className="w-20 h-4 mb-1" />
          <Bone className="w-36 h-3" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
            <div className="flex items-start gap-3">
              <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <Bone className="w-32 h-4 mb-2" />
                <Bone className="w-full h-3 mb-1" />
                <Bone className="w-3/4 h-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
