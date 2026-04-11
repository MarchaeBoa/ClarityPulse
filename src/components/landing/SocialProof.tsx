"use client";

import { Reveal } from "./motion";

const logos = [
  "Lumino",
  "Vexor",
  "Arcline",
  "Nuvem",
  "Praxis",
  "Synthex",
  "Modular",
  "Clearbit",
  "Raycast",
  "Resend",
];

function LogoItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5 shrink-0 px-8">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          width="22"
          height="22"
          rx="5"
          fill="white"
          fillOpacity="0.06"
        />
        <circle
          cx="11"
          cy="11"
          r="4"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="1.2"
        />
      </svg>
      <span className="font-display font-semibold text-[15px] text-white/25 tracking-tight whitespace-nowrap select-none">
        {name}
      </span>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="relative py-16 border-y border-white/[0.04] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <Reveal>
          <p className="text-center text-[11px] font-mono text-ghost/40 uppercase tracking-[0.15em] mb-10">
            Empresas que escolheram clareza sobre complexidade
          </p>
        </Reveal>
      </div>

      {/* CSS-based infinite marquee for better performance */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

        <div className="flex items-center animate-marquee" style={{ width: "max-content" }}>
          {[...logos, ...logos, ...logos, ...logos].map((name, i) => (
            <LogoItem key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
