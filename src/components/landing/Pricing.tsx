"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    description: "Para sites pessoais e projetos iniciais",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Comece grátis",
    popular: false,
    features: [
      "Até 10k pageviews/mês",
      "1 site",
      "6 meses de retenção de dados",
      "Dashboard completo",
      "Realtime",
      "Eventos customizados (5)",
      "1 membro",
      "Export CSV",
    ],
    limits: [
      "Sem IA Insights",
      "Sem relatórios automáticos",
    ],
  },
  {
    name: "Pro",
    description: "Para negócios em crescimento e times de produto",
    monthlyPrice: 29,
    yearlyPrice: 24,
    cta: "Iniciar teste grátis",
    popular: true,
    features: [
      "Até 200k pageviews/mês",
      "10 sites",
      "2 anos de retenção de dados",
      "Dashboard completo",
      "Realtime",
      "Eventos customizados ilimitados",
      "Goals e funis de conversão",
      "IA Insights (a cada 6h)",
      "Relatórios por email (semanal)",
      "Export CSV + PDF",
      "5 membros",
      "Integrações (Slack, Zapier)",
      "Suporte prioritário por email",
    ],
    limits: [],
  },
  {
    name: "Business",
    description: "Para empresas que precisam de controle total",
    monthlyPrice: 79,
    yearlyPrice: 66,
    cta: "Iniciar teste grátis",
    popular: false,
    features: [
      "Até 2M pageviews/mês",
      "Sites ilimitados",
      "5 anos de retenção de dados",
      "Tudo do Pro",
      "IA Insights (a cada 2h)",
      "Relatórios diários + custom",
      "Alertas automáticos",
      "API REST completa",
      "Membros ilimitados",
      "Roles granulares (Admin, Editor, Viewer)",
      "SSO / SAML",
      "DPA dedicado",
      "Suporte dedicado por chat",
      "Onboarding personalizado",
    ],
    limits: [],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Pricing
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight text-white mb-5">
            Preço justo.{" "}
            <span className="text-jade">Sem surpresas.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Comece grátis, escale quando precisar. Todos os planos incluem 14 dias
            de teste gratuito e migração assistida do GA4.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <Reveal delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn("text-[13px] transition-colors", !annual ? "text-white" : "text-ghost")}>
              Mensal
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] transition-colors"
              aria-label="Toggle billing period"
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-jade"
                animate={{ left: annual ? 26 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={cn("text-[13px] transition-colors", annual ? "text-white" : "text-ghost")}>
              Anual
            </span>
            <AnimatePresence>
              {annual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -8 }}
                  className="text-[10px] font-mono text-jade bg-jade/10 px-2 py-0.5 rounded-full"
                >
                  -17%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Pricing cards */}
        <Stagger slow className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <MotionItem key={plan.name}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                  className={cn(
                    "relative flex flex-col p-6 rounded-2xl border transition-all duration-300 h-full",
                    plan.popular
                      ? "bg-white/[0.03] border-jade/20 shadow-xl shadow-jade/[0.03]"
                      : "bg-white/[0.01] border-white/[0.06] hover:border-white/[0.1]"
                  )}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      initial={{ y: -8, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <span className="px-3 py-1 rounded-full bg-jade text-ink text-[10px] font-mono font-medium uppercase tracking-wider shadow-[0_0_16px_rgba(26,229,160,0.3)]">
                        Mais popular
                      </span>
                    </motion.div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <h3 className="font-display font-bold text-[18px] text-white tracking-tight mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-[12px] text-ghost">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-6">
                    {price === 0 ? (
                      <span className="font-display font-extrabold text-4xl text-white tracking-tight">
                        Grátis
                      </span>
                    ) : (
                      <>
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
                        <span className="text-[13px] text-ghost mb-1">/mês</span>
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "block text-center px-5 py-3 rounded-xl font-display font-semibold text-[13px] transition-all duration-200 mb-6",
                      plan.popular
                        ? "bg-jade text-ink hover:bg-jade-hover shadow-[0_0_20px_rgba(26,229,160,0.15)]"
                        : "border border-white/[0.08] text-ghost hover:text-white hover:border-white/[0.15]"
                    )}
                  >
                    {plan.cta}
                  </motion.a>

                  {/* Features */}
                  <div className="flex flex-col gap-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-jade/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={9} className="text-jade" strokeWidth={2.5} />
                        </div>
                        <span className="text-[12px] text-ghost leading-snug">{feature}</span>
                      </div>
                    ))}
                    {plan.limits.map((limit) => (
                      <div key={limit} className="flex items-start gap-2.5 opacity-40">
                        <div className="w-4 h-4 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[8px] text-ghost">—</span>
                        </div>
                        <span className="text-[12px] text-ghost leading-snug">{limit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </MotionItem>
            );
          })}
        </Stagger>

        {/* Enterprise note */}
        <Reveal delay={0.2}>
          <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-[15px] text-white mb-1 tracking-tight">
                Enterprise
              </h4>
              <p className="text-[13px] text-ghost">
                Acima de 2M pageviews? SLA customizado, ClickHouse dedicado, suporte 24/7 e
                contrato flexível. Fale com nosso time.
              </p>
            </div>
            <a
              href="#"
              className="shrink-0 px-5 py-2.5 rounded-lg border border-white/[0.08] text-ghost hover:text-white hover:border-white/[0.15] font-medium text-[13px] transition-all duration-200"
            >
              Falar com vendas →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
