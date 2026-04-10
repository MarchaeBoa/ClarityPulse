"use client";

import {
  Shield,
  Cookie,
  Fingerprint,
  Server,
  FileCheck,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";

const privacyFeatures = [
  {
    icon: Cookie,
    title: "Zero cookies",
    desc: "Nenhum cookie e setado. Nunca. Sem banner de consentimento, sem atrito na experiencia do visitante.",
  },
  {
    icon: Fingerprint,
    title: "Sem fingerprinting",
    desc: "Nao coletamos IP completo, device fingerprint ou qualquer dado que identifique um individuo.",
  },
  {
    icon: Shield,
    title: "GDPR, LGPD, ePrivacy",
    desc: "Compliant por design com as principais legislacoes de protecao de dados do mundo.",
  },
  {
    icon: Server,
    title: "Dados na EU",
    desc: "Infraestrutura hospedada na Uniao Europeia. Seus dados nunca saem da jurisdicao.",
  },
  {
    icon: FileCheck,
    title: "Dados seus, sempre",
    desc: "Exporte seus dados a qualquer momento. Cancele e leve tudo com voce. Sem lock-in.",
  },
  {
    icon: Globe,
    title: "Open-source roadmap",
    desc: "Transparencia total sobre o que coletamos, como processamos e onde armazenamos.",
  },
];

const complianceChecklist = [
  { label: "Sem cookies de rastreamento", status: "Compliant" },
  { label: "Sem dados pessoais identificaveis", status: "Compliant" },
  { label: "IP anonimizado por hash", status: "Compliant" },
  { label: "Banner de consentimento", status: "Nao necessario" },
  { label: "DPA (Data Processing Agreement)", status: "Disponivel" },
  { label: "Hospedagem EU (Frankfurt)", status: "Ativo" },
  { label: "Retencao de dados configuravel", status: "90-1825 dias" },
  { label: "Export completo de dados", status: "CSV / API" },
];

export default function PrivacyCompliance() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <Reveal direction="left">
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Privacidade & Compliance
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight mb-5">
              <span className="gradient-text-white">
                Privacidade nao e feature.
              </span>{" "}
              <span className="text-jade">E arquitetura.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8 max-w-lg">
              ClarityPulse foi construida desde o primeiro commit para respeitar
              a privacidade dos seus visitantes. Nao e um checkbox de
              compliance — e como o produto funciona.
            </p>

            <div className="flex flex-col gap-5">
              {privacyFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-jade/[0.06] border border-jade/[0.12] flex items-center justify-center shrink-0 group-hover:bg-jade/[0.1] group-hover:border-jade/[0.2] group-hover:shadow-[0_0_16px_rgba(26,229,160,0.08)] transition-all duration-300">
                      <Icon
                        size={18}
                        className="text-jade"
                        strokeWidth={1.4}
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[14px] text-white mb-1 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[12px] text-ghost leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Right — Visual */}
          <Reveal direction="right">
            <div className="bg-surface rounded-2xl border border-white/[0.08] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              {/* Privacy shield visual */}
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  className="relative"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="w-24 h-24 rounded-2xl bg-jade/[0.06] border border-jade/[0.15] flex items-center justify-center shadow-[0_0_40px_rgba(26,229,160,0.08)]">
                    <Shield
                      size={40}
                      className="text-jade"
                      strokeWidth={1.2}
                    />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-jade flex items-center justify-center shadow-[0_0_16px_rgba(26,229,160,0.3)]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M3 6L5 8L9 4"
                        stroke="#0A0B0D"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>

              {/* Compliance checklist */}
              <Stagger className="space-y-2.5">
                {complianceChecklist.map((item) => (
                  <MotionItem key={item.label}>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-300">
                      <div className="flex items-center gap-2.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <circle
                            cx="7"
                            cy="7"
                            r="6"
                            stroke="#1AE5A0"
                            strokeWidth="1.2"
                            strokeOpacity="0.3"
                          />
                          <path
                            d="M4.5 7L6 8.5L9.5 5.5"
                            stroke="#1AE5A0"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[12px] text-ghost">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-jade">
                        {item.status}
                      </span>
                    </div>
                  </MotionItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
