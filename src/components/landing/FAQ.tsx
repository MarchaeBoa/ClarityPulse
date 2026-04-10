"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./motion";

const faqs = [
  {
    question: "Como a ClarityPulse rastreia visitantes sem cookies?",
    answer:
      "Usamos um hash anonimizado baseado em dados não-identificáveis: dois octetos do IP, hash do user-agent e data. Esse hash é único por dia e não permite identificar um indivíduo. Sem cookies, sem fingerprinting, sem dados pessoais armazenados.",
  },
  {
    question: "Preciso exibir banner de consentimento de cookies?",
    answer:
      "Não. Como a ClarityPulse não usa cookies e não coleta dados pessoais identificáveis, não é necessário exibir banner de consentimento sob GDPR, LGPD ou ePrivacy. Isso significa 100% dos seus visitantes são rastreados, sem exceção.",
  },
  {
    question: "Como funciona a migração do Google Analytics?",
    answer:
      "Oferecemos migração assistida em todos os planos pagos. Nossa equipe ajuda a configurar o script, mapear eventos customizados e garantir paridade de dados. O processo leva menos de 1 hora para a maioria dos sites. Você pode rodar ambos em paralelo durante a transição.",
  },
  {
    question: "O script impacta a performance do meu site?",
    answer:
      "Nosso script pesa 4.8kb (10x menor que o gtag.js) e carrega de forma assíncrona. O impacto no LCP é imperceptível — nosso benchmark mostra menos de 5ms de overhead. Testamos continuamente contra Core Web Vitals.",
  },
  {
    question: "Os dados são 100% reais ou amostrados?",
    answer:
      "100% reais. Diferente do GA4 que amostra dados acima de 500k eventos, a ClarityPulse processa e armazena cada pageview, evento e conversão individualmente. Suas decisões são baseadas em fatos, não em estimativas.",
  },
  {
    question: "Como funcionam os insights de IA?",
    answer:
      "A cada 6 horas (2h no plano Business), executamos análises automatizadas usando GPT-4o sobre seus dados agregados. A IA identifica tendências, anomalias e oportunidades, e entrega insights acionáveis no seu dashboard. Nenhum dado pessoal é enviado para a IA — apenas métricas agregadas.",
  },
  {
    question: "Onde os dados são armazenados?",
    answer:
      "Toda nossa infraestrutura está hospedada na União Europeia (Frankfurt, Alemanha). Usamos Supabase (PostgreSQL) com Row Level Security, backups automáticos e criptografia at-rest. Os dados nunca saem da jurisdição da EU.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. Sem contrato de permanência, sem multa. Cancele quando quiser e continue usando até o fim do período pago. Você pode exportar todos os seus dados via CSV ou API antes de cancelar.",
  },
  {
    question: "Vocês oferecem SLA?",
    answer:
      "O plano Business inclui SLA de 99.9% uptime. Para Enterprise, oferecemos SLA customizado com garantias específicas, suporte 24/7 e infraestrutura dedicada. Nosso uptime histórico é de 99.97%.",
  },
  {
    question: "Posso usar em múltiplos sites?",
    answer:
      "Sim. O plano Starter inclui 1 site, Pro inclui 10 sites e Business é ilimitado. Cada site tem seu próprio dashboard, mas você gerencia todos a partir de um único workspace com alternância rápida.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border-b border-white/[0.04] last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-[14px] font-display font-semibold text-white pr-8 group-hover:text-jade transition-colors duration-200 tracking-tight">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown size={16} className="text-ghost" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[13px] text-ghost leading-relaxed pr-12 pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[720px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight text-white mb-5">
            Perguntas frequentes
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Tudo o que você precisa saber antes de começar.
          </p>
        </Reveal>

        {/* FAQ items */}
        <div className="rounded-2xl bg-surface border border-white/[0.06] px-6">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>

        {/* Contact note */}
        <Reveal delay={0.2}>
          <p className="text-center text-[13px] text-ghost mt-8">
            Não encontrou sua resposta?{" "}
            <a href="#" className="text-jade hover:text-jade-hover transition-colors underline underline-offset-2">
              Fale com nosso time
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
