"use client";

import { useState } from "react";
import { Check, X, Zap, ArrowRight, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";
import { cn } from "@/lib/utils";
import {
  PLANS,
  COMPARISON_TABLE,
  getYearlyDiscount,
  type PlanSlug,
  type PlanDefinition,
} from "@/lib/billing/plans";

const CARD_PLANS: PlanSlug[] = ["starter", "growth", "team"];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const avgDiscount = getYearlyDiscount(PLANS.growth);

  return (
    <section id="pricing" className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-jade/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Pricing
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight mb-5">
            <span className="gradient-text-white">Preco justo.</span>{" "}
            <span className="text-jade">Sem surpresas.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Escolha o plano ideal para o seu negocio. Todos os planos
            pagos incluem 14 dias de teste gratuito e migracao assistida do GA4.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className={cn(
                "text-[13px] transition-colors",
                !annual ? "text-white" : "text-ghost"
              )}
            >
              Mensal
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] transition-colors"
              aria-label="Toggle billing period"
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-jade shadow-[0_0_8px_rgba(26,229,160,0.3)]"
                animate={{ left: annual ? 26 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={cn(
                "text-[13px] transition-colors",
                annual ? "text-white" : "text-ghost"
              )}
            >
              Anual
            </span>
            <AnimatePresence>
              {annual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -8 }}
                  className="text-[10px] font-mono text-jade bg-jade/10 px-2.5 py-0.5 rounded-full border border-jade/20"
                >
                  -{avgDiscount}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-[12px] text-ghost/50 mb-10">
            Todos os planos incluem 14 dias de teste gratuito. Sem cartao de credito.
          </p>
        </Reveal>

        {/* Pricing cards */}
        <Stagger slow className="grid md:grid-cols-3 gap-5 items-start">
          {CARD_PLANS.map((slug) => {
            const plan = PLANS[slug];
            return (
              <MotionItem key={slug}>
                <PricingCard plan={plan} annual={annual} />
              </MotionItem>
            );
          })}
        </Stagger>

        {/* Enterprise banner */}
        <Reveal delay={0.2}>
          <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-jade/20 to-sapphire/20 flex items-center justify-center shrink-0">
                <Shield size={18} className="text-jade" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[15px] text-white mb-1 tracking-tight">
                  Enterprise
                </h4>
                <p className="text-[13px] text-ghost leading-relaxed max-w-lg">
                  Acima de 5M pageviews? SLA customizado, ClickHouse dedicado,
                  SSO/SAML, white label, suporte 24/7, DPA dedicado e contrato
                  flexivel.
                </p>
              </div>
            </div>
            <a
              href="#"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-jade/10 to-sapphire/10 border border-white/[0.08] text-white hover:border-jade/30 font-display font-semibold text-[13px] transition-all duration-200 flex items-center gap-2 hover:shadow-[0_0_20px_rgba(26,229,160,0.1)]"
            >
              Falar com vendas
              <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>

        {/* Comparison toggle */}
        <Reveal delay={0.3}>
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-[13px] text-ghost hover:text-white transition-colors font-medium inline-flex items-center gap-2"
            >
              {showComparison
                ? "Esconder"
                : "Comparar todos os planos em detalhe"}
              <motion.span
                animate={{ rotate: showComparison ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                &#8595;
              </motion.span>
            </button>
          </div>
        </Reveal>

        {/* Comparison table */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="overflow-hidden"
            >
              <ComparisonTable />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust signals */}
        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[11px] text-ghost/40 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Shield size={12} /> Dados no Brasil
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} /> Setup em 2 minutos
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} /> Migracao gratis do GA4
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================
   PRICING CARD
   ============================================ */
function PricingCard({
  plan,
  annual,
}: {
  plan: PlanDefinition;
  annual: boolean;
}) {
  const price = annual ? plan.priceYearly : plan.priceMonthly;
  const discount = getYearlyDiscount(plan);

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className={cn(
        "relative flex flex-col p-7 rounded-2xl border transition-all duration-300 h-full",
        plan.popular
          ? "bg-white/[0.03] border-jade/20 shadow-[0_0_60px_rgba(26,229,160,0.04),0_20px_40px_rgba(0,0,0,0.2)]"
          : "bg-white/[0.01] border-white/[0.06] hover:border-white/[0.1]"
      )}
    >
      {/* Popular badge */}
      {plan.badge && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          initial={{ y: -8, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <span className="px-3.5 py-1 rounded-full bg-jade text-ink text-[10px] font-mono font-medium uppercase tracking-wider shadow-[0_0_20px_rgba(26,229,160,0.3)] flex items-center gap-1.5">
            <Sparkles size={10} />
            {plan.badge}
          </span>
        </motion.div>
      )}

      {/* Plan header */}
      <div className="mb-5">
        <h3 className="font-display font-bold text-[18px] text-white tracking-tight mb-1">
          {plan.name}
        </h3>
        <p className="text-[12px] text-ghost leading-snug">
          {plan.description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-[14px] text-ghost mb-1">R$</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={price}
              initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }}
              className="font-display font-extrabold text-4xl text-white tracking-tight"
            >
              {price}
            </motion.span>
          </AnimatePresence>
          <span className="text-[13px] text-ghost mb-1">/mes</span>
        </div>
        {annual && discount > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[11px] text-ghost/50 line-through">
              R${plan.priceMonthly}/mes
            </span>
            <span className="text-[10px] font-mono text-jade bg-jade/10 px-1.5 py-0.5 rounded border border-jade/20">
              -{discount}%
            </span>
          </div>
        )}
        {annual && (
          <p className="text-[11px] text-ghost/40 mt-1">
            R${plan.priceYearlyTotal}/ano cobrado anualmente
          </p>
        )}
      </div>

      {/* CTA */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "block text-center px-5 py-3 rounded-xl font-display font-semibold text-[13px] transition-all duration-200 mb-6",
          plan.ctaVariant === "primary"
            ? "bg-jade text-ink hover:bg-jade-hover jade-glow-button"
            : "border border-white/[0.08] text-ghost hover:text-white hover:border-white/[0.15] hover:bg-white/[0.02]"
        )}
      >
        {plan.cta}
      </motion.a>

      {/* Key limits */}
      <div className="grid grid-cols-2 gap-2 mb-5 pb-5 border-b border-white/[0.05]">
        <LimitBadge
          label="Sites"
          value={plan.maxSites === -1 ? "Ilimitado" : String(plan.maxSites)}
        />
        <LimitBadge label="Pageviews" value={formatLimit(plan.maxPageviewsMonth)} />
        <LimitBadge
          label="Membros"
          value={
            plan.maxMembers === -1 ? "Ilimitado" : String(plan.maxMembers)
          }
        />
        <LimitBadge label="Retencao" value={plan.dataRetentionLabel} />
      </div>

      {/* Features list */}
      <div className="flex flex-col gap-2 flex-1">
        {plan.ai.chatEnabled && (
          <div className="flex items-start gap-2.5 mb-1">
            <div className="w-4 h-4 rounded-full bg-sapphire/15 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={9} className="text-sapphire" />
            </div>
            <span className="text-[12px] text-white leading-snug font-medium">
              Pulse AI —{" "}
              {plan.ai.chatMessagesPerDay === -1
                ? "Ilimitado"
                : `${plan.ai.chatMessagesPerDay} msgs/dia`}
            </span>
          </div>
        )}
        {plan.ai.insightsIntervalMs > 0 && (
          <div className="flex items-start gap-2.5 mb-1">
            <div className="w-4 h-4 rounded-full bg-sapphire/15 flex items-center justify-center shrink-0 mt-0.5">
              <Zap size={9} className="text-sapphire" />
            </div>
            <span className="text-[12px] text-ghost leading-snug">
              IA Insights {plan.ai.insightsInterval.toLowerCase()}
            </span>
          </div>
        )}

        {getDisplayFeatures(plan.slug).map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-jade/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check size={9} className="text-jade" strokeWidth={2.5} />
            </div>
            <span className="text-[12px] text-ghost leading-snug">{f}</span>
          </div>
        ))}

        {getExcludedFeatures(plan.slug).map((f) => (
          <div key={f} className="flex items-start gap-2.5 opacity-30">
            <div className="w-4 h-4 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
              <X size={8} className="text-ghost" />
            </div>
            <span className="text-[12px] text-ghost leading-snug">{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LimitBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.03]">
      <span className="text-[10px] text-ghost/40 font-mono uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[12px] text-white font-medium">{value}</span>
    </div>
  );
}

/* ============================================
   COMPARISON TABLE
   ============================================ */
function ComparisonTable() {
  const displayPlans: PlanSlug[] = [
    "starter",
    "growth",
    "team",
    "enterprise",
  ];
  const categories = Array.from(new Set(COMPARISON_TABLE.map((r) => r.category)));

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-3 text-ghost/50 font-mono uppercase tracking-wider text-[10px] w-[200px]">
              Feature
            </th>
            {displayPlans.map((slug) => (
              <th
                key={slug}
                className={cn(
                  "text-center py-3 px-2 font-display font-bold text-[13px] min-w-[100px]",
                  slug === "growth" ? "text-jade" : "text-white"
                )}
              >
                {PLANS[slug].name}
                {slug === "growth" && (
                  <span className="block text-[9px] font-mono text-jade/60 font-normal mt-0.5">
                    recomendado
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <ComparisonCategory
              key={cat}
              category={cat}
              plans={displayPlans}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonCategory({
  category,
  plans,
}: {
  category: string;
  plans: PlanSlug[];
}) {
  const rows = COMPARISON_TABLE.filter((r) => r.category === category);

  return (
    <>
      <tr>
        <td
          colSpan={plans.length + 1}
          className="pt-5 pb-2 px-3 text-[10px] font-mono text-jade uppercase tracking-[0.15em]"
        >
          {category}
        </td>
      </tr>
      {rows.map((row) => (
        <tr
          key={row.label}
          className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors"
        >
          <td className="py-2.5 px-3 text-ghost">{row.label}</td>
          {plans.map((slug) => {
            const val = row.values[slug];
            return (
              <td
                key={slug}
                className={cn(
                  "text-center py-2.5 px-2",
                  slug === "growth" && "bg-jade/[0.02]"
                )}
              >
                {typeof val === "boolean" ? (
                  val ? (
                    <Check
                      size={14}
                      className="text-jade mx-auto"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <X size={12} className="text-ghost/20 mx-auto" />
                  )
                ) : (
                  <span className="text-ghost">{val}</span>
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

/* ============================================
   HELPERS
   ============================================ */
function getDisplayFeatures(slug: PlanSlug): string[] {
  const map: Record<string, string[]> = {
    starter: [
      "Goals de conversao",
      "Relatorios semanais por email",
      "Export CSV + PDF",
      "Slack + Zapier",
      "Suporte por email (24h)",
    ],
    growth: [
      "Tudo do Starter +",
      "Funis de conversao",
      "Alertas inteligentes",
      "API REST completa",
      "Google/Meta/TikTok Ads",
      "Relatorios diarios",
      "Roles (Admin/Editor/Viewer)",
      "Suporte prioritario (4h)",
    ],
    team: [
      "Tudo do Growth +",
      "Session Replay",
      "Membros ilimitados",
      "Sites ilimitados",
      "Roles customizados",
      "Audit Log",
      "Relatorios customizados",
      "Suporte por email + chat (2h)",
    ],
  };
  return map[slug] ?? [];
}

function getExcludedFeatures(slug: PlanSlug): string[] {
  const map: Record<string, string[]> = {
    starter: ["Funis de conversao", "API REST", "Session Replay"],
    growth: ["Session Replay", "SSO/SAML"],
    team: [],
  };
  return map[slug] ?? [];
}

function formatLimit(value: number): string {
  if (value === -1) return "Ilimitado";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}
