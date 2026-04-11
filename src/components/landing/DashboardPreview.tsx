"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, Stagger, MotionItem } from "./motion";

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section
      id="dashboard-preview"
      ref={sectionRef}
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 section-divider" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Preview
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight mb-5">
            <span className="gradient-text-white">
              Um dashboard que voce
            </span>{" "}
            <span className="text-jade">realmente vai abrir todo dia.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed max-w-xl mx-auto">
            Hierarquia visual clara, dados em tempo real, e cada metrica a menos
            de 3 cliques de distancia. Projetado para product teams que tomam
            decisoes rapidas.
          </p>
        </Reveal>

        {/* Full Dashboard Mockup */}
        <motion.div className="relative" style={{ scale, opacity }}>
          {/* Glow behind */}
          <div className="absolute inset-0 bg-jade/[0.03] blur-[80px] rounded-full scale-75" />

          <div className="relative bg-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]">
            {/* Sidebar + Content Layout */}
            <div className="flex min-h-[520px]">
              {/* Sidebar */}
              <div className="hidden lg:flex flex-col w-[200px] bg-[#0d0e10] border-r border-white/[0.05] p-4">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.05]">
                  <div className="w-6 h-6 rounded bg-jade/10 border border-jade/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-jade" />
                  </div>
                  <span className="text-[12px] font-display font-semibold text-white">
                    ClarityPulse
                  </span>
                </div>

                {/* Site picker */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] mb-5">
                  <div className="w-5 h-5 rounded bg-sapphire/10 flex items-center justify-center">
                    <span className="text-[8px] font-mono font-bold text-sapphire">
                      M
                    </span>
                  </div>
                  <span className="text-[11px] text-ghost truncate flex-1">
                    meusite.com.br
                  </span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M3 4L5 6L7 4"
                      stroke="#5A5E6B"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col gap-0.5">
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Realtime", active: false },
                    { label: "Paginas", active: false },
                    { label: "Fontes", active: false },
                    { label: "Geo & Devices", active: false },
                    { label: "Conversoes", active: false },
                    { label: "Eventos", active: false },
                    { label: "IA Insights", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[11.5px] transition-colors ${
                        item.active
                          ? "bg-jade/[0.08] text-white font-medium border border-jade/[0.08]"
                          : "text-[#5A5E6B] hover:text-ghost"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.active ? "bg-jade" : "bg-[#2E3038]"
                        }`}
                      />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main content */}
              <div className="flex-1">
                {/* Topbar */}
                <div className="flex items-center justify-between px-5 py-3 h-[48px] border-b border-white/[0.05] bg-white/[0.01]">
                  <h3 className="text-[13px] font-display font-semibold text-white">
                    Dashboard
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[10px] font-mono text-ghost">
                        Ultimos 7 dias
                      </span>
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                      >
                        <path
                          d="M2 3L4 5L6 3"
                          stroke="#5A5E6B"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
                      <span className="text-[10px] font-mono text-ghost/50">
                        Live
                      </span>
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4">
                  {[
                    {
                      label: "VISITANTES UNICOS",
                      value: "24,847",
                      change: "+12.4%",
                      up: true,
                    },
                    {
                      label: "PAGEVIEWS",
                      value: "68,432",
                      change: "+8.2%",
                      up: true,
                    },
                    {
                      label: "BOUNCE RATE",
                      value: "34.2%",
                      change: "-3.1%",
                      up: true,
                    },
                    {
                      label: "DURACAO MEDIA",
                      value: "4m 07s",
                      change: "+18s",
                      up: true,
                    },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-surface-2/80 rounded-xl p-4 border border-white/[0.03]"
                    >
                      <span className="text-[9px] font-mono font-medium text-ghost/40 uppercase tracking-wider block mb-2">
                        {kpi.label}
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-display font-bold text-white tracking-tight">
                          {kpi.value}
                        </span>
                        <span
                          className={`text-[10px] font-mono mb-0.5 ${
                            kpi.up ? "text-jade" : "text-ember"
                          }`}
                        >
                          {kpi.change}
                        </span>
                      </div>
                      <div className="flex items-end gap-[2px] mt-3 h-6">
                        {[30, 40, 35, 50, 45, 55, 48, 60, 52, 65, 58, 70].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-jade/20 rounded-t-sm"
                              style={{
                                height: `${h}%`,
                                opacity: 0.3 + (i / 12) * 0.7,
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart + Sources */}
                <div className="grid lg:grid-cols-[1fr_280px] gap-3 px-4 pb-4">
                  <div className="bg-surface-2/80 rounded-xl p-4 border border-white/[0.03]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-ghost/40 uppercase tracking-wider">
                        Visitantes — 7 dias
                      </span>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-1 rounded-full bg-jade" />
                          <span className="text-[9px] font-mono text-ghost/40">
                            Atual
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-1 rounded-full bg-white/10" />
                          <span className="text-[9px] font-mono text-ghost/40">
                            Anterior
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-[3px] h-32">
                      {[
                        40, 45, 52, 48, 60, 55, 65, 58, 72, 68, 78, 74, 82, 76,
                        88, 85, 92, 80, 95, 90, 100, 96, 88, 94, 90, 86, 92,
                        88,
                      ].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col gap-[1px]"
                        >
                          <div
                            className="rounded-t-sm bg-white/[0.04]"
                            style={{ height: `${h * 0.4}px` }}
                          />
                          <div
                            className="rounded-t-sm bg-jade"
                            style={{
                              height: `${h * 0.8}px`,
                              opacity: 0.15 + (i / 28) * 0.85,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3">
                      {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map(
                        (d) => (
                          <span
                            key={d}
                            className="text-[9px] font-mono text-ghost/25"
                          >
                            {d}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Top Sources */}
                  <div className="bg-surface-2/80 rounded-xl p-4 border border-white/[0.03]">
                    <span className="text-[10px] font-mono text-ghost/40 uppercase tracking-wider block mb-4">
                      Top Fontes
                    </span>
                    <div className="flex flex-col gap-3">
                      {[
                        { source: "Google Organic", visits: "8,421", pct: 72 },
                        { source: "Direto", visits: "4,128", pct: 45 },
                        { source: "Twitter/X", visits: "2,847", pct: 32 },
                        { source: "LinkedIn", visits: "1,923", pct: 22 },
                        { source: "Newsletter", visits: "1,456", pct: 16 },
                        { source: "Product Hunt", visits: "892", pct: 10 },
                      ].map((s) => (
                        <div key={s.source}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] text-ghost">
                              {s.source}
                            </span>
                            <span className="text-[11px] font-mono text-white">
                              {s.visits}
                            </span>
                          </div>
                          <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-jade/40 rounded-full"
                              style={{ width: `${s.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature callouts */}
          <Stagger className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              {
                title: "Realtime nativo",
                description:
                  "Veja visitantes navegando pelo seu site agora. Sem delay de 24-48h como no GA4.",
              },
              {
                title: "Comparacao de periodos",
                description:
                  "Compare qualquer intervalo com o periodo anterior. Tendencias ficam obvias.",
              },
              {
                title: "Drill-down em 1 clique",
                description:
                  "Clique em qualquer fonte, pagina ou pais para detalhar. Sem relatorios exploratorios.",
              },
            ].map((feature) => (
              <MotionItem key={feature.title}>
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300">
                  <h4 className="font-display font-bold text-[14px] text-white mb-2 tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-[12px] text-ghost leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </MotionItem>
            ))}
          </Stagger>
        </motion.div>
      </div>
    </section>
  );
}
