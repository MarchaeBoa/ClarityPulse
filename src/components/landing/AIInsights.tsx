"use client";

import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";

const insights = [
  {
    icon: TrendingUp,
    type: "Tendencia",
    typeBg: "bg-jade/10",
    typeColor: "text-jade",
    title: "Trafego organico em alta consistente",
    description:
      "Nos ultimos 14 dias, visitantes de busca organica cresceram 23.4%. As paginas /blog/guia-seo e /recursos/templates sao os maiores drivers. Sugestao: produza mais conteudo na categoria 'guias praticos'.",
    time: "Gerado ha 2h",
    confidence: 94,
  },
  {
    icon: AlertCircle,
    type: "Anomalia",
    typeBg: "bg-ember/10",
    typeColor: "text-ember",
    title: "Bounce rate incomum em /pricing",
    description:
      "A pagina /pricing apresentou bounce rate de 78% nos ultimos 3 dias (media historica: 52%). Visitantes mobile sao os mais afetados. Possivel causa: carregamento lento de imagens acima do fold.",
    time: "Gerado ha 4h",
    confidence: 87,
  },
  {
    icon: Lightbulb,
    type: "Oportunidade",
    typeBg: "bg-sapphire/10",
    typeColor: "text-sapphire",
    title: "Newsletter subutilizado como canal",
    description:
      "Visitantes vindos da newsletter tem taxa de conversao 3.1x maior que a media e tempo de sessao 2.4x superior. Porem representam apenas 6% do trafego. Aumente a frequencia de envios para capitalizar.",
    time: "Gerado ha 6h",
    confidence: 91,
  },
];

export default function AIInsights() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sapphire/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Insight cards */}
          <Stagger slow className="order-2 lg:order-1 flex flex-col gap-4">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <MotionItem key={insight.title}>
                  <motion.div
                    whileHover={{
                      x: 4,
                      transition: { duration: 0.2 },
                    }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 card-shine"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-md ${insight.typeBg} flex items-center justify-center`}
                        >
                          <Icon
                            size={12}
                            className={insight.typeColor}
                            strokeWidth={1.6}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-mono font-medium uppercase tracking-wider ${insight.typeColor}`}
                        >
                          {insight.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-jade/40 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${insight.confidence}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-[9px] font-mono text-ghost/40">
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-[14px] text-white mb-2 tracking-tight">
                      {insight.title}
                    </h4>
                    <p className="text-[12px] text-ghost leading-relaxed mb-3">
                      {insight.description}
                    </p>
                    <span className="text-[10px] font-mono text-ghost/30">
                      {insight.time}
                    </span>
                  </motion.div>
                </MotionItem>
              );
            })}

            {/* Chat preview card */}
            <MotionItem>
              <div className="p-5 rounded-2xl bg-surface border border-white/[0.08] shadow-lg shadow-black/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-jade/10 flex items-center justify-center">
                    <MessageSquare size={12} className="text-jade" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-jade uppercase tracking-wider">
                    Pulse AI Chat
                  </span>
                </div>

                {/* Chat bubbles */}
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="px-3 py-2 rounded-xl rounded-br-md bg-white/[0.06] border border-white/[0.06] max-w-[240px]">
                      <p className="text-[11px] text-ghost">
                        Qual canal trouxe mais conversoes esta semana?
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="px-3 py-2 rounded-xl rounded-bl-md bg-jade/[0.06] border border-jade/[0.1] max-w-[280px]">
                      <p className="text-[11px] text-ghost leading-relaxed">
                        Google Organic lidera com{" "}
                        <span className="text-white font-medium">847 conversoes</span>{" "}
                        (+12.4%). LinkedIn ficou em segundo com 234,
                        mas com taxa de conversao 2.3x maior.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionItem>
          </Stagger>

          {/* Right — Copy */}
          <Reveal
            direction="right"
            className="order-1 lg:order-2 lg:sticky lg:top-32"
          >
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Pulse AI
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight mb-5">
              <span className="gradient-text-white">
                Insights que chegam antes
              </span>{" "}
              <span className="text-jade">de voce perguntar.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8">
              A cada 6 horas, a ClarityPulse analisa seus dados com IA e entrega
              insights acionaveis: tendencias, anomalias e oportunidades que
              voce levaria dias para descobrir manualmente.
            </p>

            <div className="flex flex-col gap-5">
              {[
                {
                  icon: Sparkles,
                  title: "Analise automatica a cada 6h",
                  desc: "Sem SQL, sem filtros manuais. A IA varre seus dados e destaca o que importa.",
                },
                {
                  icon: TrendingUp,
                  title: "Deteccao de anomalias",
                  desc: "Mudancas abruptas em metricas sao detectadas e explicadas automaticamente.",
                },
                {
                  icon: Lightbulb,
                  title: "Sugestoes acionaveis",
                  desc: "Nao apenas 'o que aconteceu', mas 'o que fazer sobre isso'.",
                },
                {
                  icon: MessageSquare,
                  title: "Chat com seus dados",
                  desc: "Pergunte em linguagem natural. A IA responde com dados reais do seu site.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-jade/[0.06] border border-jade/[0.12] flex items-center justify-center shrink-0 group-hover:bg-jade/[0.1] group-hover:border-jade/[0.2] group-hover:shadow-[0_0_16px_rgba(26,229,160,0.08)] transition-all duration-300">
                      <Icon
                        size={18}
                        className="text-jade"
                        strokeWidth={1.4}
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[14px] text-white mb-1 tracking-tight">
                        {feature.title}
                      </h4>
                      <p className="text-[12px] text-ghost leading-relaxed">
                        {feature.desc}
                      </p>
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
