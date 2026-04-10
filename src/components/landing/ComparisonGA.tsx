"use client";

import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "./motion";

type Status = "yes" | "no" | "partial";

interface ComparisonRow {
  feature: string;
  clarity: Status;
  ga4: Status;
  clarityNote?: string;
  gaNote?: string;
}

const comparisons: ComparisonRow[] = [
  {
    feature: "Sem cookies",
    clarity: "yes",
    ga4: "no",
    gaNote: "Usa cookies de rastreamento",
  },
  {
    feature: "GDPR compliant sem config",
    clarity: "yes",
    ga4: "no",
    gaNote: "Requer consent mode",
  },
  {
    feature: "Dados 100% (sem amostragem)",
    clarity: "yes",
    ga4: "partial",
    gaNote: "Amostra acima de 500k",
  },
  {
    feature: "Script < 5kb",
    clarity: "yes",
    clarityNote: "4.8kb",
    ga4: "no",
    gaNote: "45kb+",
  },
  {
    feature: "Dashboard intuitivo",
    clarity: "yes",
    ga4: "partial",
    gaNote: "Curva de aprendizado alta",
  },
  {
    feature: "Realtime nativo",
    clarity: "yes",
    ga4: "partial",
    gaNote: "Delay de 24-48h em reports",
  },
  { feature: "IA Insights automaticos", clarity: "yes", ga4: "no" },
  {
    feature: "Relatorios por email",
    clarity: "yes",
    ga4: "partial",
    gaNote: "Limitado",
  },
  { feature: "Funis de conversao", clarity: "yes", ga4: "yes" },
  { feature: "Eventos customizados", clarity: "yes", ga4: "yes" },
  {
    feature: "Sem limite de dados",
    clarity: "yes",
    clarityNote: "Por plano",
    ga4: "yes",
  },
  {
    feature: "Suporte dedicado",
    clarity: "yes",
    ga4: "no",
    gaNote: "Apenas forum",
  },
  {
    feature: "Dados na EU",
    clarity: "yes",
    ga4: "partial",
    gaNote: "Requer configuracao",
  },
  {
    feature: "Setup em < 5 min",
    clarity: "yes",
    ga4: "partial",
    gaNote: "30-60 min com GTM",
  },
];

function StatusIcon({ status, note }: { status: Status; note?: string }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {status === "yes" && (
        <div className="w-5 h-5 rounded-full bg-jade/10 flex items-center justify-center">
          <Check size={12} className="text-jade" strokeWidth={2.5} />
        </div>
      )}
      {status === "no" && (
        <div className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center">
          <X size={12} className="text-ghost/30" strokeWidth={2} />
        </div>
      )}
      {status === "partial" && (
        <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center">
          <Minus size={12} className="text-gold" strokeWidth={2} />
        </div>
      )}
      {note && (
        <span className="text-[10px] font-mono text-ghost/40 hidden md:inline">
          {note}
        </span>
      )}
    </div>
  );
}

export default function ComparisonGA() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      <div className="max-w-[1000px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Comparacao
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight mb-5">
            <span className="text-white">ClarityPulse vs</span>{" "}
            <span className="text-ghost/40">Google Analytics</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Nao e sobre ser contra o Google. E sobre ter uma alternativa que
            prioriza privacidade, simplicidade e dados reais.
          </p>
        </Reveal>

        {/* Comparison table */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl bg-surface border border-white/[0.08] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_140px_140px] md:grid-cols-[1fr_180px_180px] items-center px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="text-[10px] font-mono text-ghost/40 uppercase tracking-wider">
                Funcionalidade
              </span>
              <div className="text-center">
                <span className="text-[13px] font-display font-bold text-jade">
                  ClarityPulse
                </span>
              </div>
              <div className="text-center">
                <span className="text-[13px] font-display font-bold text-ghost/40">
                  GA4
                </span>
              </div>
            </div>

            {/* Table rows */}
            {comparisons.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className={`grid grid-cols-[1fr_140px_140px] md:grid-cols-[1fr_180px_180px] items-center px-6 py-3.5 ${
                  i !== comparisons.length - 1
                    ? "border-b border-white/[0.04]"
                    : ""
                } hover:bg-white/[0.02] transition-colors`}
              >
                <span className="text-[13px] text-ghost">{row.feature}</span>
                <div className="flex justify-center">
                  <StatusIcon
                    status={row.clarity}
                    note={row.clarityNote}
                  />
                </div>
                <div className="flex justify-center">
                  <StatusIcon status={row.ga4} note={row.gaNote} />
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-center text-[11px] font-mono text-ghost/30 mt-6">
            Comparacao baseada em funcionalidades publicas. Atualizado em Abril
            2026.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
