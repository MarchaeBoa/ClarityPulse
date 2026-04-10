"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LimitCheckResult } from "@/lib/billing/usage";

// ============================================================
// USAGE BAR
// Barra de progresso animada mostrando uso vs limite.
// Muda de cor conforme se aproxima do limite.
// ============================================================

interface UsageBarProps {
  check: LimitCheckResult;
  label: string;
  showNumbers?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function UsageBar({
  check,
  label,
  showNumbers = true,
  size = "md",
  className,
}: UsageBarProps) {
  const percentage = Math.min(check.percentage, 100);
  const isUnlimited = check.limit === -1;

  const barColor =
    check.status === "exceeded"
      ? "bg-ember"
      : check.status === "warning"
      ? "bg-gold"
      : "bg-jade";

  const textColor =
    check.status === "exceeded"
      ? "text-ember"
      : check.status === "warning"
      ? "text-gold"
      : "text-ghost";

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn("font-medium", size === "sm" ? "text-[11px]" : "text-[12px]", "text-ghost")}>
          {label}
        </span>
        {showNumbers && (
          <span className={cn("font-mono", size === "sm" ? "text-[10px]" : "text-[11px]", textColor)}>
            {isUnlimited ? (
              "Ilimitado"
            ) : (
              <>
                {formatCompact(check.current)} / {formatCompact(check.limit)}
                {check.status !== "ok" && (
                  <span className="ml-1">({check.percentage}%)</span>
                )}
              </>
            )}
          </span>
        )}
      </div>

      {/* Bar */}
      {!isUnlimited && (
        <div
          className={cn(
            "w-full rounded-full overflow-hidden bg-white/[0.04]",
            size === "sm" ? "h-1" : "h-1.5"
          )}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: 0.1 }}
            className={cn("h-full rounded-full transition-colors", barColor)}
          />
        </div>
      )}

      {/* Warning text */}
      {check.status === "exceeded" && (
        <p className="text-[10px] text-ember mt-1 font-medium">
          Limite excedido — faça upgrade para continuar
        </p>
      )}
      {check.status === "warning" && (
        <p className="text-[10px] text-gold mt-1">
          {check.percentage}% do limite usado
        </p>
      )}
    </div>
  );
}

// ============================================================
// USAGE OVERVIEW CARD
// Card compacto com todas as barras de uso do workspace
// ============================================================

interface UsageOverviewProps {
  checks: {
    label: string;
    check: LimitCheckResult;
  }[];
  planName: string;
  className?: string;
}

export function UsageOverview({ checks, planName, className }: UsageOverviewProps) {
  return (
    <div className={cn("p-4 rounded-xl bg-white/[0.01] border border-white/[0.06]", className)}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[13px] font-display font-semibold text-white">
          Uso do plano
        </h4>
        <span className="text-[10px] font-mono text-jade bg-jade/10 px-2 py-0.5 rounded-full">
          {planName}
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {checks.map(({ label, check }) => (
          <UsageBar key={label} check={check} label={label} size="sm" />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("pt-BR");
}
