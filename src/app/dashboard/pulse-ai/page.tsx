"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PulseAIChat } from "@/components/dashboard/pulse-ai/PulseAIChat";

/* ------------------------------------------------------------------ */
/*  Loading Skeleton                                                   */
/* ------------------------------------------------------------------ */

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

function PulseAISkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Bone className="w-10 h-10 rounded-xl" />
        <div>
          <Bone className="w-28 h-6 mb-1.5" />
          <Bone className="w-52 h-3" />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 rounded-xl border border-black/[0.04] dark:border-white/[0.04] flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Bone className="w-16 h-16 rounded-2xl mb-5" />
          <Bone className="w-72 h-5 mb-2" />
          <Bone className="w-96 h-4 mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full max-w-3xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04]"
              >
                <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <Bone className="w-20 h-3 mb-1.5" />
                  <Bone className="w-full h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input skeleton */}
        <div className="border-t border-black/[0.04] dark:border-white/[0.04] p-4">
          <div className="flex items-end gap-2">
            <Bone className="flex-1 h-11 rounded-xl" />
            <Bone className="w-10 h-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function PulseAIPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PulseAISkeleton />;
  }

  return <PulseAIChat />;
}
