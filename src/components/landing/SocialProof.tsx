"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion";

const logos = [
  "Lumino", "Vexor", "Arcline", "Nuvem",
  "Praxis", "Synthex", "Modular", "Clearbit",
];

function LogoItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0 px-6">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect width="20" height="20" rx="4" fill="white" fillOpacity="0.08" />
        <circle cx="10" cy="10" r="4" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
      </svg>
      <span className="font-display font-semibold text-[14px] text-white/30 tracking-tight whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function SocialProof() {
  const allLogos = [...logos, ...logos];

  return (
    <section className="relative py-16 border-y border-white/[0.04] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <p className="text-center text-[11px] font-mono text-ghost/40 uppercase tracking-[0.15em] mb-10">
            Empresas que escolheram clareza sobre complexidade
          </p>
        </Reveal>
      </div>

      {/* Infinite marquee */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center"
          animate={{ x: [0, -(logos.length * 160)] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {allLogos.map((name, i) => (
            <LogoItem key={`${name}-${i}`} name={name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
