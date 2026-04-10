"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AIResponseSection } from "@/lib/pulse-ai/engine";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sections?: AIResponseSection[];
  timestamp: string;
  isLatest?: boolean;
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-white dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
      <span className="text-[11px] text-ghost font-medium truncate">
        {label}
      </span>
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm font-bold text-ink dark:text-white">
          {value}
        </span>
        {change != null && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-[11px] font-semibold",
              change > 0
                ? "text-jade"
                : change < 0
                ? "text-ember"
                : "text-ghost"
            )}
          >
            {change > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : change < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}

function AIResponseRenderer({
  sections,
}: {
  sections: AIResponseSection[];
}) {
  return (
    <div className="space-y-3">
      {sections.map((section, i) => {
        switch (section.type) {
          case "text":
            return (
              <p key={i} className="text-[13px] leading-relaxed text-ink/80 dark:text-ghost-2">
                {renderBold(section.content)}
              </p>
            );

          case "metric":
            return (
              <div key={i} className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ghost/60">
                  {section.content}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {section.metrics?.map((m, j) => (
                    <MetricCard
                      key={j}
                      label={m.label}
                      value={m.value}
                      change={m.change}
                    />
                  ))}
                </div>
              </div>
            );

          case "list":
            return (
              <div key={i} className="space-y-1.5">
                {section.items?.map((item, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-2 text-[13px] leading-relaxed text-ink/80 dark:text-ghost-2"
                  >
                    <span className="text-jade mt-1 flex-shrink-0">
                      &bull;
                    </span>
                    <span>{renderBold(item)}</span>
                  </div>
                ))}
              </div>
            );

          case "highlight":
            return (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-jade/[0.04] dark:bg-jade/[0.06] border border-jade/10 dark:border-jade/15"
              >
                <p className="text-[13px] leading-relaxed text-ink/80 dark:text-ghost-2">
                  {renderBold(section.content)}
                </p>
              </div>
            );

          case "action":
            return (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-sapphire/[0.04] dark:bg-sapphire/[0.06] border border-sapphire/10 dark:border-sapphire/15"
              >
                <p className="text-[13px] leading-relaxed text-ink/80 dark:text-ghost-2">
                  {renderBold(section.content)}
                </p>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export function ChatMessage({
  role,
  content,
  sections,
  timestamp,
  isLatest,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={isLatest ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          isUser
            ? "bg-ink dark:bg-white/10"
            : "bg-gradient-to-br from-jade/20 to-sapphire/20"
        )}
      >
        {isUser ? (
          <span className="text-[11px] font-bold text-white dark:text-white/80">
            U
          </span>
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-jade" />
        )}
      </div>

      {/* Message */}
      <div className={cn("flex-1 max-w-[85%] min-w-0", isUser && "flex flex-col items-end")}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-semibold text-ink dark:text-white">
            {isUser ? "Você" : "Pulse AI"}
          </span>
          <span className="text-[10px] text-ghost">{timestamp}</span>
        </div>

        <div
          className={cn(
            "rounded-2xl",
            isUser
              ? "bg-ink dark:bg-white/[0.08] text-white dark:text-white px-4 py-3 rounded-tr-md"
              : "bg-white dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] px-4 py-4 rounded-tl-md"
          )}
        >
          {isUser ? (
            <p className="text-[13px] leading-relaxed">{content}</p>
          ) : sections ? (
            <AIResponseRenderer sections={sections} />
          ) : (
            <p className="text-[13px] leading-relaxed text-ink/80 dark:text-ghost-2">
              {renderBold(content)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
