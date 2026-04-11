"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, Float, Stagger, MotionItem } from "./motion";

/* ============================================
   ANIMATED COUNTER
   ============================================ */
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1400;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent =
              Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ============================================
   DASHBOARD MOCKUP
   ============================================ */
function DashboardMockup() {
  return (
    <div className="relative w-full">
      <div className="dashboard-perspective">
        {/* Ambient glow behind dashboard */}
        <div className="absolute -inset-8 bg-jade/[0.04] blur-[60px] rounded-full" />

        <div className="relative bg-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)]">
          {/* Topbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-jade/10 border border-jade/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-jade" />
              </div>
              <span className="text-[11px] font-mono text-ghost">
                meusite.com.br
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ghost/60">
                Ultimos 7 dias
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-4 gap-3 p-4">
            {[
              {
                label: "VISITANTES",
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
                value: "34%",
                change: "-3.1%",
                up: true,
              },
              {
                label: "TEMPO MEDIO",
                value: "4m07s",
                change: "+18s",
                up: true,
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="bg-surface-2/80 rounded-xl p-3 border border-white/[0.03]"
              >
                <span className="text-[9px] font-mono font-medium tracking-wider text-ghost/50 uppercase block mb-2">
                  {kpi.label}
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-lg font-display font-bold text-white tracking-tight">
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
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="px-4 pb-4">
            <div className="bg-surface-2/80 rounded-xl p-4 border border-white/[0.03]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono text-ghost/50 uppercase tracking-wider">
                  Visitantes unicos
                </span>
                <div className="flex gap-3">
                  <span className="text-[10px] font-mono text-jade">
                    Este periodo
                  </span>
                  <span className="text-[10px] font-mono text-ghost/30">
                    Anterior
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-[3px] h-24">
                {[
                  35, 42, 38, 56, 48, 62, 55, 71, 64, 78, 72, 85, 68, 92, 88,
                  95, 82, 98, 90, 100, 94, 88, 96, 92,
                ].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm bg-jade"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{
                      height: `${h * 0.85}px`,
                      opacity: 0.3 + (i / 24) * 0.7,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + i * 0.03,
                      ease: [0.25, 0.4, 0.25, 1],
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — AI Insight */}
      <Float delay={0} duration={6} y={14}>
        <div className="absolute -right-4 top-16 glass-card-strong rounded-2xl p-3.5 shadow-xl shadow-black/30 hidden lg:block">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-jade/10 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 1L6.5 3.5L9 5L6.5 6.5L5 9L3.5 6.5L1 5L3.5 3.5L5 1Z"
                  fill="#1AE5A0"
                />
              </svg>
            </div>
            <span className="text-[10px] font-mono font-medium text-jade uppercase tracking-wider">
              AI Insight
            </span>
          </div>
          <p className="text-[11px] text-ghost leading-relaxed max-w-[180px]">
            Trafego organico subiu 23% apos
            <br />a publicacao do blog de terca.
          </p>
        </div>
      </Float>

      {/* Floating badge — Realtime */}
      <Float delay={2} duration={7} y={10}>
        <div className="absolute -left-4 bottom-20 glass-card-strong rounded-2xl p-3.5 shadow-xl shadow-black/30 hidden lg:block">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-jade animate-pulse" />
            <span className="text-[10px] font-mono text-ghost">
              <span className="text-white font-medium">47</span> visitantes
              agora
            </span>
          </div>
        </div>
      </Float>
    </div>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background effects */}
      <motion.div
        className="absolute inset-0 hero-gradient"
        style={{ opacity: bgOpacity }}
      />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-jade/[0.03] blur-[120px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sapphire/[0.02] blur-[100px]"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-10 items-center">
          {/* Left — Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8 badge-glow"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
              <span className="text-[11px] font-mono text-ghost tracking-wide">
                Analytics redefinido — sem cookies, com inteligencia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.35,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="font-display font-extrabold text-[clamp(36px,5.5vw,64px)] leading-[0.92] tracking-[-0.03em] mb-6"
            >
              <span className="gradient-text-white">Veja o que importa,</span>{" "}
              <span className="gradient-text-jade">
                nao o que e permitido.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-base lg:text-lg text-ghost leading-relaxed max-w-[440px] mb-10"
            >
              ClarityPulse e o analytics que seus visitantes confiam e seu time
              precisa. Sem cookies, 100% GDPR, com IA que transforma dados em
              decisoes — nao em dashboards bonitos que ninguem entende.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <motion.a
                href="#pricing"
                whileHover={{
                  scale: 1.03,
                  boxShadow:
                    "0 0 40px rgba(26,229,160,0.25), 0 0 80px rgba(26,229,160,0.1)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-jade text-ink font-display font-bold text-[14px] hover:bg-jade-hover transition-colors duration-200 jade-glow-button"
              >
                Comece gratis — 14 dias
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="#dashboard-preview"
                whileHover={{
                  scale: 1.02,
                  borderColor: "rgba(255,255,255,0.15)",
                }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/[0.08] text-ghost hover:text-white font-medium text-[14px] transition-all duration-200 hover:bg-white/[0.02]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M6.5 5.5L10.5 8L6.5 10.5V5.5Z"
                    fill="currentColor"
                  />
                </svg>
                Ver demonstracao
              </motion.a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {[
                "Script de 4.8kb",
                "Setup em 2 minutos",
                "Sem cartao de credito",
              ].map((signal) => (
                <div key={signal} className="flex items-center gap-2">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2.5 6L5 8.5L9.5 4"
                      stroke="#1AE5A0"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[11px] font-mono text-ghost/50 tracking-wide">
                    {signal}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 60, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            style={{ y: dashboardY }}
          >
            <DashboardMockup />
          </motion.div>
        </div>

        {/* Metrics bar */}
        <Stagger className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/[0.04] pt-10">
          {[
            { value: 2400, suffix: "+", label: "Sites monitorados" },
            { value: 8, suffix: "B+", label: "Eventos processados" },
            { value: 99, suffix: ".9%", label: "Uptime garantido" },
            { value: 47, suffix: "ms", label: "Latencia p99" },
          ].map((stat) => (
            <MotionItem key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] font-mono text-ghost/40 uppercase tracking-wider">
                {stat.label}
              </div>
            </MotionItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
