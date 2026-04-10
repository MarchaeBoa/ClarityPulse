"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion";

export default function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[600px] h-[400px] rounded-full bg-jade/[0.04] blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-[700px] mx-auto px-6 text-center">
        <Reveal>
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-jade/[0.06] border border-jade/[0.12] mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            <span className="text-[11px] font-mono text-jade tracking-wide">
              Setup em 2 minutos. Sem cartão de crédito.
            </span>
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display font-extrabold text-[clamp(32px,5vw,56px)] leading-[0.92] tracking-[-0.03em] text-white mb-6">
            Seus dados merecem{" "}
            <span className="text-jade">mais clareza.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-lg text-ghost leading-relaxed mb-10 max-w-lg mx-auto">
            Junte-se a milhares de empresas que escolheram analytics que respeita
            seus visitantes e entrega insights reais. Comece hoje, grátis.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <motion.a
              href="#pricing"
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(26,229,160,0.2), 0 0 120px rgba(26,229,160,0.05)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-jade text-ink font-display font-bold text-[15px] hover:bg-jade-hover transition-colors duration-200 jade-glow"
            >
              Comece grátis — 14 dias
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 5L12 9L7 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/[0.08] text-ghost hover:text-white font-medium text-[15px] transition-all duration-200"
            >
              Agendar demonstração
            </motion.a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              "14 dias grátis",
              "Sem cartão de crédito",
              "Migração assistida do GA4",
              "Cancele quando quiser",
            ].map((signal) => (
              <div key={signal} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="#1AE5A0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[11px] font-mono text-ghost/50 tracking-wide">
                  {signal}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
