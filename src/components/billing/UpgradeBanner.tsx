"use client";

import { useState } from "react";
import { X, ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PLANS, type PlanSlug } from "@/lib/billing/plans";
import type { PaywallMessage } from "@/lib/billing/paywall";

// ============================================================
// UPGRADE BANNER
// Banner persistente exibido no topo do dashboard para
// incentivar upgrades — trial ending, limit warnings, etc.
// ============================================================

interface UpgradeBannerProps {
  message: PaywallMessage;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function UpgradeBanner({
  message,
  dismissible = true,
  onDismiss,
  className,
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const plan = PLANS[message.targetPlan];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className={cn("overflow-hidden", className)}
        >
          <div
            className={cn(
              "relative flex items-center gap-4 px-5 py-3 rounded-xl border",
              message.tone === "urgent"
                ? "bg-ember/[0.06] border-ember/20"
                : message.tone === "value"
                ? "bg-gradient-to-r from-jade/[0.04] to-sapphire/[0.04] border-jade/10"
                : "bg-white/[0.02] border-white/[0.06]"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                message.tone === "urgent"
                  ? "bg-ember/10"
                  : "bg-jade/10"
              )}
            >
              {message.tone === "urgent" ? (
                <Zap size={15} className="text-ember" />
              ) : message.tone === "value" ? (
                <Sparkles size={15} className="text-jade" />
              ) : (
                <TrendingUp size={15} className="text-jade" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white font-medium truncate">
                {message.title}
              </p>
              <p className="text-[11px] text-ghost truncate mt-0.5">
                {message.description}
              </p>
            </div>

            {/* CTA */}
            <a
              href="#"
              className={cn(
                "shrink-0 px-4 py-2 rounded-lg font-display font-semibold text-[12px] transition-all duration-200 flex items-center gap-1.5",
                message.tone === "urgent"
                  ? "bg-ember text-white hover:bg-ember/90"
                  : "bg-jade text-ink hover:bg-jade-hover"
              )}
            >
              {message.cta}
              <ArrowRight size={12} />
            </a>

            {/* Dismiss */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="shrink-0 w-6 h-6 rounded-md hover:bg-white/[0.06] flex items-center justify-center text-ghost hover:text-white transition-all"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// INLINE UPGRADE NUDGE
// Versão menor, usada inline em cards/seções do dashboard
// ============================================================

interface UpgradeNudgeProps {
  text: string;
  targetPlan: PlanSlug;
  className?: string;
}

export function UpgradeNudge({ text, targetPlan, className }: UpgradeNudgeProps) {
  const plan = PLANS[targetPlan];

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-jade/[0.04] to-transparent border border-jade/10",
        className
      )}
    >
      <Sparkles size={14} className="text-jade shrink-0" />
      <p className="text-[11px] text-ghost flex-1">{text}</p>
      <a
        href="#"
        className="shrink-0 text-[11px] font-mono text-jade hover:text-jade-hover transition-colors flex items-center gap-1"
      >
        {plan.name} →
      </a>
    </div>
  );
}
