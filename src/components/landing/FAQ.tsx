"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./motion";

const faqs = [
  {
    question: "Como a ClarityPulse rastreia visitantes sem cookies?",
    answer:
      "Usamos um hash anonimizado baseado em dados nao-identificaveis: dois octetos do IP, hash do user-agent e data. Esse hash e unico por dia e nao permite identificar um individuo. Sem cookies, sem fingerprinting, sem dados pessoais armazenados.",
  },
  {
    question: "Preciso exibir banner de consentimento de cookies?",
    answer:
      "Nao. Como a ClarityPulse nao usa cookies e nao coleta dados pessoais identificaveis, nao e necessario exibir banner de consentimento sob GDPR, LGPD ou ePrivacy. Isso significa 100% dos seus visitantes sao rastreados, sem excecao.",
  },
  {
    question: "Como funciona a migracao do Google Analytics?",
    answer:
      "Oferecemos migracao assistida em todos os planos pagos. Nossa equipe ajuda a configurar o script, mapear eventos customizados e garantir paridade de dados. O processo leva menos de 1 hora para a maioria dos sites. Voce pode rodar ambos em paralelo durante a transicao.",
  },
  {
    question: "O script impacta a performance do meu site?",
    answer:
      "Nosso script pesa 4.8kb (10x menor que o gtag.js) e carrega de forma assincrona. O impacto no LCP e imperceptivel — nosso benchmark mostra menos de 5ms de overhead. Testamos continuamente contra Core Web Vitals.",
  },
  {
    question: "Os dados sao 100% reais ou amostrados?",
    answer:
      "100% reais. Diferente do GA4 que amostra dados acima de 500k eventos, a ClarityPulse processa e armazena cada pageview, evento e conversao individualmente. Suas decisoes sao baseadas em fatos, nao em estimativas.",
  },
  {
    question: "Como funcionam os insights de IA?",
    answer:
      "A cada 6 horas (1h no plano Team), executamos analises automatizadas sobre seus dados agregados. A IA identifica tendencias, anomalias e oportunidades, e entrega insights acionaveis no seu dashboard. Nenhum dado pessoal e enviado para a IA — apenas metricas agregadas.",
  },
  {
    question: "Onde os dados sao armazenados?",
    answer:
      "Toda nossa infraestrutura esta hospedada na Uniao Europeia (Frankfurt, Alemanha). Usamos PostgreSQL com Row Level Security, backups automaticos e criptografia at-rest. Os dados nunca saem da jurisdicao da EU.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. Sem contrato de permanencia, sem multa. Cancele quando quiser e continue usando ate o fim do periodo pago. Voce pode exportar todos os seus dados via CSV ou API antes de cancelar.",
  },
  {
    question: "Voces oferecem SLA?",
    answer:
      "O plano Team inclui SLA de 99.9% uptime. Para Enterprise, oferecemos SLA customizado com garantias especificas, suporte 24/7 e infraestrutura dedicada. Nosso uptime historico e de 99.97%.",
  },
  {
    question: "Posso usar em multiplos sites?",
    answer:
      "Sim. O plano Starter inclui 3 sites, Growth inclui 10 sites e Team e ilimitado. Cada site tem seu proprio dashboard, mas voce gerencia todos a partir de um unico workspace com alternancia rapida.",
  },
];

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
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
          className="shrink-0 w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-jade/10 transition-colors duration-200"
        >
          <ChevronDown size={14} className="text-ghost group-hover:text-jade transition-colors" />
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
    <section id="faq" className="relative py-28 lg:py-36">
      <div className="absolute inset-x-0 top-0 section-divider" />

      <div className="max-w-[720px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="text-center mb-12">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            FAQ
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight mb-5">
            <span className="gradient-text-white">Perguntas frequentes</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            Tudo o que voce precisa saber antes de comecar.
          </p>
        </Reveal>

        {/* FAQ items */}
        <div className="rounded-2xl bg-surface border border-white/[0.08] px-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={i}
            />
          ))}
        </div>

        {/* Contact note */}
        <Reveal delay={0.2}>
          <p className="text-center text-[13px] text-ghost mt-8">
            Nao encontrou sua resposta?{" "}
            <a
              href="#"
              className="text-jade hover:text-jade-hover transition-colors underline underline-offset-2"
            >
              Fale com nosso time
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
