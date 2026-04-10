"use client";

import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";

const insights = [
  {
    icon: TrendingUp,
    type: "Tendência",
    typeBg: "bg-jade/10",
    typeColor: "text-jade",
    title: "Tráfego orgânico em alta consistente",
    description:
      "Nos últimos 14 dias, visitantes de busca orgânica cresceram 23.4%. As páginas /blog/guia-seo e /recursos/templates são os maiores drivers. Sugestão: produza mais conteúdo na categoria 'guias práticos'.",
    time: "Gerado há 2h",
    confidence: 94,
  },
  {
    icon: AlertCircle,
    type: "Anomalia",
    typeBg: "bg-ember/10",
    typeColor: "text-ember",
    title: "Bounce rate incomum em /pricing",
    description:
      "A página /pricing apresentou bounce rate de 78% nos últimos 3 dias (média histórica: 52%). Visitantes mobile são os mais afetados. Possível causa: carregamento lento de imagens acima do fold.",
    time: "Gerado há 4h",
    confidence: 87,
  },
  {
    icon: Lightbulb,
    type: "Oportunidade",
    typeBg: "bg-sapphire/10",
    typeColor: "text-sapphire",
    title: "Newsletter subutilizado como canal",
    description:
      "Visitantes vindos da newsletter têm taxa de conversão 3.1x maior que a média e tempo de sessão 2.4x superior. Porém representam apenas 6% do tráfego. Aumente a frequência de envios para capitalizar.",
    time: "Gerado há 6h",
    confidence: 91,
  },
];

export default function AIInsights() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Insight cards */}
          <Stagger slow className="order-2 lg:order-1 flex flex-col gap-4">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <MotionItem key={insight.title}>
                  <motion.div
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="p-5 rounded-2xl bg-surface border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md ${insight.typeBg} flex items-center justify-center`}>
                          <Icon size={12} className={insight.typeColor} strokeWidth={1.6} />
                        </div>
                        <span className={`text-[10px] font-mono font-medium uppercase tracking-wider ${insight.typeColor}`}>
                          {insight.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-jade/40 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${insight.confidence}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-ghost/40">{insight.confidence}%</span>
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-[14px] text-white mb-2 tracking-tight">
                      {insight.title}
                    </h4>
                    <p className="text-[12px] text-ghost leading-relaxed mb-3">
                      {insight.description}
                    </p>
                    <span className="text-[10px] font-mono text-ghost/30">{insight.time}</span>
                  </motion.div>
                </MotionItem>
              );
            })}
          </Stagger>

          {/* Right — Copy */}
          <Reveal direction="right" className="order-1 lg:order-2 lg:sticky lg:top-32">
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Inteligência Artificial
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight text-white mb-5">
              Insights que chegam antes{" "}
              <span className="text-jade">de você perguntar.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8">
              A cada 6 horas, a ClarityPulse analisa seus dados com GPT-4o e entrega
              insights acionáveis: tendências, anomalias e oportunidades que você
              levaria dias para descobrir manualmente.
            </p>

            <div className="flex flex-col gap-5">
              {[
                {
                  icon: Sparkles,
                  title: "Análise automática a cada 6h",
                  desc: "Sem SQL, sem filtros manuais. A IA varre seus dados e destaca o que importa.",
                },
                {
                  icon: TrendingUp,
                  title: "Detecção de anomalias",
                  desc: "Mudanças abruptas em métricas são detectadas e explicadas automaticamente.",
                },
                {
                  icon: Lightbulb,
                  title: "Sugestões acionáveis",
                  desc: "Não apenas 'o que aconteceu', mas 'o que fazer sobre isso'.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-jade/[0.06] border border-jade/[0.12] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-jade" strokeWidth={1.4} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[14px] text-white mb-1 tracking-tight">
                        {feature.title}
                      </h4>
                      <p className="text-[12px] text-ghost leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
