"use client";

import { Fragment, type ReactNode } from "react";
import { X, Sparkles, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PaywallMessage } from "@/lib/billing/paywall";
import { PLANS, type PlanSlug } from "@/lib/billing/plans";

// ============================================================
// PAYWALL MODAL
// Exibido quando o usuário tenta acessar um recurso bloqueado.
// Design elegante, não-intrusivo, focado em valor.
// ============================================================

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  message: PaywallMessage;
  /** Optional preview/illustration of the blocked feature */
  preview?: ReactNode;
}

export default function PaywallModal({ open, onClose, message, preview }: PaywallModalProps) {
  const plan = PLANS[message.targetPlan];

  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={cn(
                "relative w-full max-w-md pointer-events-auto rounded-2xl border overflow-hidden",
                message.tone === "urgent"
                  ? "bg-surface border-ember/20"
                  : "bg-surface border-white/[0.08]"
              )}
            >
              {/* Gradient top accent */}
              <div
                className={cn(
                  "absolute top-0 inset-x-0 h-[2px]",
                  message.tone === "urgent"
                    ? "bg-gradient-to-r from-ember via-gold to-ember"
                    : "bg-gradient-to-r from-jade via-sapphire to-jade"
                )}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-ghost hover:text-white transition-all"
              >
                <X size={14} />
              </button>

              <div className="p-6 pt-8">
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-5",
                    message.tone === "urgent"
                      ? "bg-ember/10"
                      : "bg-gradient-to-br from-jade/15 to-sapphire/15"
                  )}
                >
                  {message.tone === "urgent" ? (
                    <Zap size={20} className="text-ember" />
                  ) : (
                    <Sparkles size={20} className="text-jade" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-[18px] text-white tracking-tight mb-2 leading-snug">
                  {message.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-ghost leading-relaxed mb-6">
                  {message.description}
                </p>

                {/* Optional feature preview */}
                {preview && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-white/[0.05] bg-white/[0.01]">
                    {preview}
                  </div>
                )}

                {/* Plan highlight */}
                {plan.priceMonthly > 0 && (
                  <div className="mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-ghost/60 font-mono uppercase tracking-wider">
                        Plano {plan.name}
                      </p>
                      <p className="text-[13px] text-white font-medium mt-0.5">
                        A partir de R${plan.priceYearly}/mês
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-jade bg-jade/10 px-2 py-1 rounded-full">
                      {plan.trialDays} dias grátis
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col gap-2.5">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-display font-semibold text-[13px] transition-all duration-200",
                      message.tone === "urgent"
                        ? "bg-ember text-white hover:bg-ember/90 shadow-[0_0_20px_rgba(255,99,71,0.15)]"
                        : "bg-jade text-ink hover:bg-jade-hover shadow-[0_0_20px_rgba(26,229,160,0.15)]"
                    )}
                  >
                    {message.cta}
                    <ArrowRight size={14} />
                  </motion.a>

                  {message.ctaSecondary && (
                    <button
                      onClick={onClose}
                      className="text-[12px] text-ghost hover:text-white transition-colors py-2"
                    >
                      {message.ctaSecondary}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
