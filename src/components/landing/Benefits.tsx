"use client";

import { Eye, Zap, Brain, Lock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";

const benefits = [
  {
    icon: Eye,
    title: "Dados 100% reais",
    subtitle: "Zero amostragem",
    description:
      "Cada pageview, cada clique, cada conversao. Sem amostragem, sem estimativas. Decisoes baseadas em fatos, nao em probabilidades.",
    stat: "100%",
    statLabel: "dos dados reais",
    gradient: "from-jade/20 to-jade/5",
    borderHover: "hover:border-jade/20",
  },
  {
    icon: Zap,
    title: "4.8kb que nao pesam",
    subtitle: "Script ultraleve",
    description:
      "Nosso script pesa menos que uma imagem favicon. Carregamento assincrono com zero impacto no seu Core Web Vitals.",
    stat: "10x",
    statLabel: "mais leve que GA4",
    gradient: "from-gold/20 to-gold/5",
    borderHover: "hover:border-gold/20",
  },
  {
    icon: Brain,
    title: "IA que interpreta por voce",
    subtitle: "Insights automaticos",
    description:
      "Enquanto voce dorme, a ClarityPulse analisa seus dados e entrega insights acionaveis. Sem SQL, sem relatorios manuais.",
    stat: "6h",
    statLabel: "ciclo de analise",
    gradient: "from-sapphire/20 to-sapphire/5",
    borderHover: "hover:border-sapphire/20",
  },
  {
    icon: Lock,
    title: "Privacidade by design",
    subtitle: "Sem cookies",
    description:
      "Sem cookies, sem banner de consentimento, sem fingerprinting. GDPR, LGPD e ePrivacy compliant por padrao.",
    stat: "0",
    statLabel: "cookies rastreadores",
    gradient: "from-jade/20 to-jade/5",
    borderHover: "hover:border-jade/20",
  },
  {
    icon: BarChart3,
    title: "De dado a acao em segundos",
    subtitle: "Dashboard intuitivo",
    description:
      "Interface desenhada por product designers. Cada metrica e encontrada em menos de 3 cliques. Sem curva de aprendizado.",
    stat: "<3",
    statLabel: "cliques ate o insight",
    gradient: "from-ember/20 to-ember/5",
    borderHover: "hover:border-ember/20",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center mb-20">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Por que ClarityPulse
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight mb-5">
            <span className="gradient-text-white">
              Analytics que entrega valor,
            </span>{" "}
            <span className="text-jade">nao complexidade.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed max-w-xl mx-auto">
            Cada funcionalidade foi desenhada com um objetivo: transformar dados
            em decisoes. Sem friccao, sem curva de aprendizado, sem compromissos
            com privacidade.
          </p>
        </Reveal>

        {/* Benefits grid — top row: 3 cards, bottom row: 2 cards centered */}
        <div className="space-y-5">
          <Stagger slow className="grid md:grid-cols-3 gap-5">
            {benefits.slice(0, 3).map((benefit) => (
              <MotionItem key={benefit.title}>
                <BenefitCard benefit={benefit} />
              </MotionItem>
            ))}
          </Stagger>
          <Stagger slow className="grid md:grid-cols-2 gap-5 max-w-[800px] mx-auto">
            {benefits.slice(3).map((benefit) => (
              <MotionItem key={benefit.title}>
                <BenefitCard benefit={benefit} />
              </MotionItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  benefit,
}: {
  benefit: (typeof benefits)[number];
}) {
  const Icon = benefit.icon;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3, ease: "easeOut" } }}
      className={`group relative p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] ${benefit.borderHover} transition-all duration-400 h-full flex flex-col card-shine`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-jade/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Icon */}
      <div className="relative w-12 h-12 rounded-xl bg-jade/[0.06] border border-jade/[0.12] flex items-center justify-center mb-6 group-hover:bg-jade/[0.1] group-hover:border-jade/[0.2] group-hover:shadow-[0_0_20px_rgba(26,229,160,0.1)] transition-all duration-300">
        <Icon size={22} className="text-jade" strokeWidth={1.4} />
      </div>

      {/* Content */}
      <div className="relative mb-4">
        <span className="text-[10px] font-mono text-jade/60 uppercase tracking-wider">
          {benefit.subtitle}
        </span>
        <h3 className="font-display font-bold text-[18px] text-white mt-1.5 tracking-tight">
          {benefit.title}
        </h3>
      </div>

      <p className="relative text-[13px] text-ghost leading-relaxed mb-6 flex-1">
        {benefit.description}
      </p>

      {/* Stat */}
      <div className="relative flex items-end gap-2 pt-5 border-t border-white/[0.04]">
        <span className="font-display font-extrabold text-3xl text-jade tracking-tight">
          {benefit.stat}
        </span>
        <span className="text-[11px] font-mono text-ghost/50 mb-1.5">
          {benefit.statLabel}
        </span>
      </div>
    </motion.div>
  );
}
