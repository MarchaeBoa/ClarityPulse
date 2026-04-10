"use client";

import { useEffect, useRef } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      el!.textContent = start.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function DashboardMockup() {
  return (
    <div className="relative w-full">
      <div className="dashboard-perspective">
        <div className="bg-surface rounded-xl border border-white/[0.06] overflow-hidden shadow-2xl">
          {/* Topbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-jade/10 border border-jade/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-jade" />
              </div>
              <span className="text-[11px] font-mono text-ghost">meusite.com.br</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ghost/60">Últimos 7 dias</span>
              <div className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-4 gap-px bg-white/[0.03] p-4">
            {[
              { label: "VISITANTES", value: 24847, change: "+12.4%", up: true },
              { label: "PAGEVIEWS", value: 68432, change: "+8.2%", up: true },
              { label: "BOUNCE RATE", value: 34, change: "-3.1%", up: true },
              { label: "TEMPO MÉDIO", value: 247, change: "+18s", up: true },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-2 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[9px] font-mono font-medium tracking-wider text-ghost/60 uppercase">
                    {kpi.label}
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-lg font-display font-bold text-white tracking-tight">
                    {kpi.label === "BOUNCE RATE"
                      ? `${kpi.value}%`
                      : kpi.label === "TEMPO MÉDIO"
                      ? "4m07s"
                      : kpi.value.toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] font-mono mb-0.5 ${
                      kpi.up ? "text-jade" : "text-ember"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="px-4 pb-4">
            <div className="bg-surface-2 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-ghost/60 uppercase tracking-wider">
                  Visitantes únicos
                </span>
                <div className="flex gap-3">
                  <span className="text-[10px] font-mono text-jade">Este período</span>
                  <span className="text-[10px] font-mono text-ghost/40">Anterior</span>
                </div>
              </div>
              {/* Simulated bar chart */}
              <div className="flex items-end gap-1 h-24">
                {[35, 42, 38, 56, 48, 62, 55, 71, 64, 78, 72, 85, 68, 92, 88, 95, 82, 98, 90, 100, 94, 88, 96, 92].map(
                  (h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-stretch gap-0.5">
                      <div
                        className="rounded-t-sm bg-jade/20"
                        style={{ height: `${h * 0.5}px` }}
                      />
                      <div
                        className="rounded-t-sm bg-jade"
                        style={{ height: `${h * 0.85}px`, opacity: 0.3 + (i / 24) * 0.7 }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — AI Insight */}
      <div className="absolute -right-2 top-16 bg-surface border border-white/[0.08] rounded-xl p-3 shadow-xl animate-float hidden lg:block">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-md bg-jade/10 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L6.5 3.5L9 5L6.5 6.5L5 9L3.5 6.5L1 5L3.5 3.5L5 1Z" fill="#1AE5A0"/>
            </svg>
          </div>
          <span className="text-[10px] font-mono font-medium text-jade uppercase tracking-wider">AI Insight</span>
        </div>
        <p className="text-[11px] text-ghost leading-relaxed max-w-[180px]">
          Tráfego orgânico subiu 23% após<br />
          a publicação do blog de terça.
        </p>
      </div>

      {/* Floating badge — Realtime */}
      <div className="absolute -left-2 bottom-20 bg-surface border border-white/[0.08] rounded-xl p-3 shadow-xl animate-float hidden lg:block" style={{ animationDelay: "2s" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-jade animate-pulse" />
          <span className="text-[10px] font-mono text-ghost">
            <span className="text-white font-medium">47</span> visitantes agora
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-10 items-center">
          {/* Left — Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-jade" />
              <span className="text-[11px] font-mono text-ghost tracking-wide">
                Analytics redefinido — sem cookies, com inteligência
              </span>
            </div>

            <h1 className="font-display font-extrabold text-[clamp(36px,5.5vw,64px)] leading-[0.92] tracking-[-0.03em] text-white mb-6">
              Veja o que importa,{" "}
              <span className="text-jade">não o que é permitido.</span>
            </h1>

            <p className="text-base lg:text-lg text-ghost leading-relaxed max-w-[440px] mb-10">
              ClarityPulse é o analytics que seus visitantes confiam e seu time
              precisa. Sem cookies, 100% GDPR, com IA que transforma dados em
              decisões — não em dashboards bonitos que ninguém entende.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-jade text-ink font-display font-semibold text-[14px] hover:bg-jade-hover transition-all duration-200 active:scale-[0.97] jade-glow-subtle"
              >
                Comece grátis — 14 dias
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="#dashboard-preview"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/[0.08] text-ghost hover:text-white hover:border-white/[0.15] font-medium text-[14px] transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z" fill="currentColor"/>
                </svg>
                Ver demonstração
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                "Script de 4.8kb",
                "Setup em 2 minutos",
                "Sem cartão de crédito",
              ].map((signal) => (
                <div key={signal} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 4" stroke="#1AE5A0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[11px] font-mono text-[#3E4047] tracking-wide">
                    {signal}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard Preview */}
          <div className="relative">
            <DashboardMockup />
          </div>
        </div>

        {/* Metrics bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.04] pt-10">
          {[
            { value: 2400, suffix: "+", label: "Sites monitorados" },
            { value: 8, suffix: "B+", label: "Eventos processados" },
            { value: 99, suffix: ".9%", label: "Uptime garantido" },
            { value: 47, suffix: "ms", label: "Latência p99" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] font-mono text-ghost/50 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
