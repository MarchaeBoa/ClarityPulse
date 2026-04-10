import { Target, MousePointerClick, GitBranch, TrendingUp } from "lucide-react";

export default function EventsConversions() {
  return (
    <section id="eventos" className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Eventos & Conversões
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight text-white mb-5">
              Cada clique conta uma história.{" "}
              <span className="text-jade">Agora você ouve.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8 max-w-lg">
              Defina eventos customizados com uma linha de código. Crie goals por URL,
              evento ou funil. Acompanhe conversões por fonte, campanha e período —
              tudo em tempo real.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: "Goals flexíveis", desc: "URL match, evento ou sequência de páginas" },
                { icon: MousePointerClick, title: "Eventos custom", desc: "clarity('track', 'signup') — uma linha" },
                { icon: GitBranch, title: "Funis visuais", desc: "Veja onde os visitantes abandonam" },
                { icon: TrendingUp, title: "Conversão por fonte", desc: "Qual canal realmente converte" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <Icon size={18} className="text-jade mb-3" strokeWidth={1.4} />
                    <h4 className="font-display font-bold text-[13px] text-white mb-1 tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-ghost leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Visual mockup */}
          <div className="relative">
            <div className="bg-surface rounded-2xl border border-white/[0.06] p-5 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-[13px] font-display font-semibold text-white">Funil de Conversão</h4>
                  <span className="text-[10px] font-mono text-ghost/50">Cadastro — Últimos 30 dias</span>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-jade/[0.06] border border-jade/[0.12]">
                  <span className="text-[10px] font-mono text-jade">4.2% conv. rate</span>
                </div>
              </div>

              {/* Funnel steps */}
              <div className="flex flex-col gap-2">
                {[
                  { step: "Landing Page", value: "24,847", pct: 100 },
                  { step: "Página de Pricing", value: "8,412", pct: 55 },
                  { step: "Início do Cadastro", value: "3,284", pct: 28 },
                  { step: "Email Verificado", value: "1,847", pct: 16 },
                  { step: "Setup Concluído", value: "1,042", pct: 10 },
                ].map((s, i) => (
                  <div key={s.step}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-ghost/40 w-4">{i + 1}.</span>
                        <span className="text-[12px] text-ghost">{s.step}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-mono text-white">{s.value}</span>
                        {i > 0 && (
                          <span className="text-[10px] font-mono text-ember">
                            -{(100 - s.pct)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 bg-white/[0.02] rounded-lg overflow-hidden border border-white/[0.04]">
                      <div
                        className="h-full rounded-lg transition-all duration-700"
                        style={{
                          width: `${s.pct}%`,
                          background: `linear-gradient(90deg, rgba(26, 229, 160, ${0.15 + (s.pct / 100) * 0.25}), rgba(26, 229, 160, ${0.05 + (s.pct / 100) * 0.1}))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom insight */}
              <div className="mt-5 p-3 rounded-xl bg-jade/[0.04] border border-jade/[0.1] flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-jade/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L6.5 3.5L9 5L6.5 6.5L5 9L3.5 6.5L1 5L3.5 3.5L5 1Z" fill="#1AE5A0"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-jade block mb-0.5">AI Insight</span>
                  <p className="text-[11px] text-ghost leading-relaxed">
                    O maior drop-off (65%) ocorre entre Landing e Pricing. Visitantes vindos do LinkedIn
                    convertem 2.3x mais que a média. Considere CTA direto para pricing em campanhas orgânicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
