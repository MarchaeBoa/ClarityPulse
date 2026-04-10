"use client";

import { Target, MousePointerClick, GitBranch, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";

export default function EventsConversions() {
  return (
    <section id="eventos" className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <Reveal direction="left">
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Eventos & Conversoes
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight mb-5">
              <span className="gradient-text-white">
                Cada clique conta uma historia.
              </span>{" "}
              <span className="text-jade">Agora voce ouve.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8 max-w-lg">
              Defina eventos customizados com uma linha de codigo. Crie goals
              por URL, evento ou funil. Acompanhe conversoes por fonte, campanha
              e periodo — tudo em tempo real.
            </p>

            <Stagger className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Target,
                  title: "Goals flexiveis",
                  desc: "URL match, evento ou sequencia de paginas",
                },
                {
                  icon: MousePointerClick,
                  title: "Eventos custom",
                  desc: "clarity('track', 'signup') — uma linha",
                },
                {
                  icon: GitBranch,
                  title: "Funis visuais",
                  desc: "Veja onde os visitantes abandonam",
                },
                {
                  icon: TrendingUp,
                  title: "Conversao por fonte",
                  desc: "Qual canal realmente converte",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <MotionItem key={item.title}>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-jade/15 hover:bg-white/[0.03] transition-all duration-300 card-shine">
                      <Icon
                        size={18}
                        className="text-jade mb-3"
                        strokeWidth={1.4}
                      />
                      <h4 className="font-display font-bold text-[13px] text-white mb-1 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-ghost leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </MotionItem>
                );
              })}
            </Stagger>
          </Reveal>

          {/* Right — Visual mockup */}
          <Reveal direction="right">
            <div className="bg-surface rounded-2xl border border-white/[0.08] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-[13px] font-display font-semibold text-white">
                    Funil de Conversao
                  </h4>
                  <span className="text-[10px] font-mono text-ghost/50">
                    Cadastro — Ultimos 30 dias
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-jade/[0.06] border border-jade/[0.12]">
                  <span className="text-[10px] font-mono text-jade">
                    4.2% conv. rate
                  </span>
                </div>
              </div>

              {/* Funnel steps */}
              <div className="flex flex-col gap-2">
                {[
                  { step: "Landing Page", value: "24,847", pct: 100 },
                  { step: "Pagina de Pricing", value: "8,412", pct: 55 },
                  { step: "Inicio do Cadastro", value: "3,284", pct: 28 },
                  { step: "Email Verificado", value: "1,847", pct: 16 },
                  { step: "Setup Concluido", value: "1,042", pct: 10 },
                ].map((s, i) => (
                  <div key={s.step}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-ghost/40 w-4">
                          {i + 1}.
                        </span>
                        <span className="text-[12px] text-ghost">
                          {s.step}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-mono text-white">
                          {s.value}
                        </span>
                        {i > 0 && (
                          <span className="text-[10px] font-mono text-ember">
                            -{100 - s.pct}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 bg-white/[0.02] rounded-lg overflow-hidden border border-white/[0.04]">
                      <motion.div
                        className="h-full rounded-lg"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.12,
                          ease: [0.25, 0.4, 0.25, 1],
                        }}
                        style={{
                          background: `linear-gradient(90deg, rgba(26, 229, 160, ${
                            0.12 + (s.pct / 100) * 0.28
                          }), rgba(26, 229, 160, ${
                            0.04 + (s.pct / 100) * 0.08
                          }))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom insight */}
              <div className="mt-5 p-3.5 rounded-xl bg-jade/[0.04] border border-jade/[0.1] flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-jade/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M5 1L6.5 3.5L9 5L6.5 6.5L5 9L3.5 6.5L1 5L3.5 3.5L5 1Z"
                      fill="#1AE5A0"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-jade block mb-0.5">
                    AI Insight
                  </span>
                  <p className="text-[11px] text-ghost leading-relaxed">
                    O maior drop-off (65%) ocorre entre Landing e Pricing.
                    Visitantes vindos do LinkedIn convertem 2.3x mais que a
                    media. Considere CTA direto para pricing em campanhas
                    organicas.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
