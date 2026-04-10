import { AlertTriangle, Clock, Cookie, Brain, Shield, Zap } from "lucide-react";

const painPoints = [
  {
    icon: Cookie,
    title: "Banners de cookies espantam visitantes",
    description:
      "42% dos visitantes rejeitam cookies. Você perde quase metade dos seus dados antes de começar a analisar.",
    accent: "ember",
  },
  {
    icon: AlertTriangle,
    title: "Dados amostrais que mentem",
    description:
      "O GA4 amostra dados acima de 500k eventos. Suas decisões de negócio estão baseadas em estimativas, não em fatos.",
    accent: "gold",
  },
  {
    icon: Clock,
    title: "30 minutos para achar um número",
    description:
      "Relatórios exploratórios, segmentos encadeados, dimensões secundárias. Você precisa de respostas, não de um curso.",
    accent: "ember",
  },
  {
    icon: Brain,
    title: "Dados sem significado",
    description:
      "Ter dados não é ter insights. Sem IA interpretando padrões, seu dashboard é um painel bonito que ninguém consulta.",
    accent: "sapphire",
  },
  {
    icon: Shield,
    title: "Compliance que nunca acaba",
    description:
      "GDPR, LGPD, ePrivacy. A cada regulamentação, mais configuração. Analytics não deveria ser um risco jurídico.",
    accent: "ember",
  },
  {
    icon: Zap,
    title: "Scripts que pesam 45kb+",
    description:
      "gtag.js carrega 45kb+ e adiciona 300ms+ ao LCP. Seu analytics está sabotando seu Core Web Vitals.",
    accent: "gold",
  },
];

const accentMap: Record<string, { bg: string; text: string; border: string }> = {
  ember: { bg: "bg-ember/10", text: "text-ember", border: "border-ember/20" },
  gold: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20" },
  sapphire: { bg: "bg-sapphire/10", text: "text-sapphire", border: "border-sapphire/20" },
};

export default function WhySwitch() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[11px] font-mono text-ember uppercase tracking-[0.15em] mb-4">
            O problema
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight text-white mb-5">
            Seu analytics atual está{" "}
            <span className="text-ember">trabalhando contra você.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Google Analytics foi desenhado para anunciantes. Não para product teams,
            founders ou profissionais de marketing que precisam de respostas rápidas
            e dados confiáveis.
          </p>
        </div>

        {/* Pain points grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {painPoints.map((point) => {
            const colors = accentMap[point.accent];
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}
                >
                  <Icon size={18} className={colors.text} strokeWidth={1.4} />
                </div>
                <h3 className="font-display font-bold text-[15px] text-white mb-2 tracking-tight">
                  {point.title}
                </h3>
                <p className="text-[13px] text-ghost leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
