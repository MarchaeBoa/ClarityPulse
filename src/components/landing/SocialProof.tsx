export default function SocialProof() {
  const logos = [
    { name: "Lumino", width: "w-20" },
    { name: "Vexor", width: "w-16" },
    { name: "Arcline", width: "w-20" },
    { name: "Nuvem", width: "w-18" },
    { name: "Praxis", width: "w-16" },
    { name: "Synthex", width: "w-20" },
    { name: "Modular", width: "w-18" },
    { name: "Clearbit", width: "w-20" },
  ];

  return (
    <section className="relative py-16 border-y border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-[11px] font-mono text-ghost/40 uppercase tracking-[0.15em] mb-10">
          Empresas que escolheram clareza sobre complexidade
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 opacity-30 hover:opacity-50 transition-opacity duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect width="20" height="20" rx="4" fill="white" fillOpacity="0.08" />
                <circle cx="10" cy="10" r="4" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
              </svg>
              <span className="font-display font-semibold text-[14px] text-white tracking-tight">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
