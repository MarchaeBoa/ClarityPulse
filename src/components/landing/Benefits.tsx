import { Eye, Zap, Brain, Lock, Users, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: Eye,
    title: "Dados 100% reais",
    subtitle: "Zero amostragem",
    description:
      "Cada pageview, cada clique, cada conversão. Sem amostragem, sem estimativas. Decisões baseadas em fatos, não em probabilidades.",
    stat: "100%",
    statLabel: "dos dados reais",
  },
  {
    icon: Zap,
    title: "4.8kb que não pesam",
    subtitle: "Script ultraleve",
    description:
      "Nosso script pesa menos que uma imagem favicon. Carregamento assíncrono com zero impacto no seu Core Web Vitals.",
    stat: "10x",
    statLabel: "mais leve que GA4",
  },
  {
    icon: Brain,
    title: "IA que interpreta por você",
    subtitle: "Insights automáticos",
    description:
      "Enquanto você dorme, a ClarityPulse analisa seus dados e entrega insights acionáveis. Sem SQL, sem relatórios manuais.",
    stat: "6h",
    statLabel: "ciclo de análise",
  },
  {
    icon: Lock,
    title: "Privacidade by design",
    subtitle: "Sem cookies",
    description:
      "Sem cookies, sem banner de consentimento, sem fingerprinting. GDPR, LGPD e ePrivacy compliant por padrão.",
    stat: "0",
    statLabel: "cookies rastreadores",
  },
  {
    icon: Users,
    title: "Feito para times",
    subtitle: "Colaboração nativa",
    description:
      "Múltiplos sites, roles de acesso, relatórios automáticos por email. Todo o time na mesma página, literalmente.",
    stat: "∞",
    statLabel: "membros por workspace",
  },
  {
    icon: BarChart3,
    title: "De dado a ação em segundos",
    subtitle: "Dashboard intuitivo",
    description:
      "Interface desenhada por product designers, não por engenheiros de banco de dados. Cada métrica é encontrada em menos de 3 cliques.",
    stat: "<3",
    statLabel: "cliques até o insight",
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="relative py-24 lg:py-32">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Por que ClarityPulse
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight text-white mb-5">
            Analytics que entrega valor,{" "}
            <span className="text-jade">não complexidade.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Cada funcionalidade foi desenhada com um objetivo: transformar dados em
            decisões. Sem fricção, sem curva de aprendizado, sem compromissos com
            privacidade.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-jade/20 hover:bg-jade/[0.02] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-jade/[0.06] border border-jade/[0.12] flex items-center justify-center mb-5 group-hover:bg-jade/[0.1] transition-colors">
                  <Icon size={20} className="text-jade" strokeWidth={1.4} />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono text-jade/60 uppercase tracking-wider">
                    {benefit.subtitle}
                  </span>
                  <h3 className="font-display font-bold text-[17px] text-white mt-1 tracking-tight">
                    {benefit.title}
                  </h3>
                </div>

                <p className="text-[13px] text-ghost leading-relaxed mb-5">
                  {benefit.description}
                </p>

                {/* Stat */}
                <div className="flex items-end gap-2 pt-4 border-t border-white/[0.04]">
                  <span className="font-display font-extrabold text-2xl text-jade tracking-tight">
                    {benefit.stat}
                  </span>
                  <span className="text-[11px] font-mono text-ghost/50 mb-1">
                    {benefit.statLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
