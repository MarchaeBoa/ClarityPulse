import { Shield, Cookie, Fingerprint, Server, FileCheck, Globe } from "lucide-react";

export default function PrivacyCompliance() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Privacidade & Compliance
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight text-white mb-5">
              Privacidade não é feature.{" "}
              <span className="text-jade">É arquitetura.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8 max-w-lg">
              ClarityPulse foi construída desde o primeiro commit para respeitar a
              privacidade dos seus visitantes. Não é um checkbox de compliance —
              é como o produto funciona.
            </p>

            <div className="flex flex-col gap-5">
              {[
                {
                  icon: Cookie,
                  title: "Zero cookies",
                  desc: "Nenhum cookie é setado. Nunca. Sem banner de consentimento, sem atrito na experiência do visitante.",
                },
                {
                  icon: Fingerprint,
                  title: "Sem fingerprinting",
                  desc: "Não coletamos IP completo, device fingerprint ou qualquer dado que identifique um indivíduo.",
                },
                {
                  icon: Shield,
                  title: "GDPR, LGPD, ePrivacy",
                  desc: "Compliant por design com as principais legislações de proteção de dados do mundo.",
                },
                {
                  icon: Server,
                  title: "Dados na EU",
                  desc: "Infraestrutura hospedada na União Europeia. Seus dados nunca saem da jurisdição.",
                },
                {
                  icon: FileCheck,
                  title: "Dados seus, sempre",
                  desc: "Exporte seus dados a qualquer momento. Cancele e leve tudo com você. Sem lock-in.",
                },
                {
                  icon: Globe,
                  title: "Open-source roadmap",
                  desc: "Transparência total sobre o que coletamos, como processamos e onde armazenamos.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-jade/[0.06] border border-jade/[0.12] flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-jade" strokeWidth={1.4} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[14px] text-white mb-1 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-ghost leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Visual */}
          <div className="relative">
            <div className="bg-surface rounded-2xl border border-white/[0.06] p-8 shadow-xl">
              {/* Privacy shield visual */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-jade/[0.06] border border-jade/[0.15] flex items-center justify-center">
                    <Shield size={40} className="text-jade" strokeWidth={1.2} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-jade flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6L5 8L9 4" stroke="#0A0B0D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Compliance checklist */}
              <div className="space-y-3">
                {[
                  { label: "Sem cookies de rastreamento", status: "Compliant" },
                  { label: "Sem dados pessoais identificáveis", status: "Compliant" },
                  { label: "IP anonimizado por hash", status: "Compliant" },
                  { label: "Banner de consentimento", status: "Não necessário" },
                  { label: "DPA (Data Processing Agreement)", status: "Disponível" },
                  { label: "Hospedagem EU (Frankfurt)", status: "Ativo" },
                  { label: "Retenção de dados configurável", status: "90-1825 dias" },
                  { label: "Export completo de dados", status: "CSV / API" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="#1AE5A0" strokeWidth="1.2" strokeOpacity="0.3"/>
                        <path d="M4.5 7L6 8.5L9.5 5.5" stroke="#1AE5A0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[12px] text-ghost">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-jade">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
