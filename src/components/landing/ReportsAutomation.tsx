import { FileText, Mail, Calendar, Download, Bell, Repeat } from "lucide-react";

export default function ReportsAutomation() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Mockup */}
          <div className="relative">
            {/* Email report mockup */}
            <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 shadow-xl">
              {/* Email header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.05]">
                <div className="w-8 h-8 rounded-lg bg-jade/10 border border-jade/20 flex items-center justify-center">
                  <FileText size={14} className="text-jade" />
                </div>
                <div>
                  <span className="text-[12px] font-display font-semibold text-white block">Relatório Semanal</span>
                  <span className="text-[10px] font-mono text-ghost/50">meusite.com.br — 31 Mar a 6 Abr</span>
                </div>
              </div>

              {/* Report KPIs */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Visitantes", value: "24,847", change: "+12.4%" },
                  { label: "Conversões", value: "1,042", change: "+8.7%" },
                  { label: "Receita atrib.", value: "R$ 47.2k", change: "+15.3%" },
                ].map((kpi) => (
                  <div key={kpi.label} className="p-3 rounded-xl bg-surface-2 border border-white/[0.03]">
                    <span className="text-[9px] font-mono text-ghost/40 uppercase tracking-wider block mb-1">
                      {kpi.label}
                    </span>
                    <span className="text-[15px] font-display font-bold text-white block">{kpi.value}</span>
                    <span className="text-[10px] font-mono text-jade">{kpi.change}</span>
                  </div>
                ))}
              </div>

              {/* Top pages mini table */}
              <div className="mb-5">
                <span className="text-[9px] font-mono text-ghost/40 uppercase tracking-wider block mb-3">
                  Top Páginas
                </span>
                {[
                  { page: "/blog/guia-completo-seo", views: "4,821" },
                  { page: "/pricing", views: "3,412" },
                  { page: "/recursos/templates", views: "2,847" },
                ].map((p) => (
                  <div key={p.page} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                    <span className="text-[11px] font-mono text-ghost truncate max-w-[200px]">{p.page}</span>
                    <span className="text-[11px] font-mono text-white">{p.views}</span>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div className="p-3 rounded-xl bg-jade/[0.04] border border-jade/[0.1]">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L6.5 3.5L9 5L6.5 6.5L5 9L3.5 6.5L1 5L3.5 3.5L5 1Z" fill="#1AE5A0"/>
                  </svg>
                  <span className="text-[10px] font-mono text-jade">Resumo IA</span>
                </div>
                <p className="text-[11px] text-ghost leading-relaxed">
                  Semana excepcional. Tráfego orgânico sustenta crescimento pelo 3o mês
                  consecutivo. Conversão mobile melhorou 18% após a otimização da página
                  de pricing. Recomendação: escalar produção de conteúdo SEO.
                </p>
              </div>
            </div>

            {/* Floating schedule badge */}
            <div className="absolute -right-2 -bottom-4 bg-surface border border-white/[0.08] rounded-xl p-3 shadow-xl hidden md:block">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-jade" />
                <span className="text-[10px] font-mono text-ghost">
                  Próximo envio: <span className="text-white">Segunda, 8:00</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right — Copy */}
          <div>
            <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
              Relatórios & Automações
            </span>
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] leading-[0.95] tracking-tight text-white mb-5">
              Relatórios que trabalham{" "}
              <span className="text-jade">enquanto você não.</span>
            </h2>
            <p className="text-base text-ghost leading-relaxed mb-8 max-w-lg">
              Configure uma vez, receba para sempre. PDFs automáticos, emails
              semanais com resumo IA e exports CSV para quando você precisa dos
              dados crus.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Mail, title: "Email semanal", desc: "Resumo com KPIs, top pages e insight IA" },
                { icon: FileText, title: "PDF automático", desc: "Relatório completo pronto para compartilhar" },
                { icon: Download, title: "Export CSV", desc: "Dados brutos para sua planilha ou BI" },
                { icon: Bell, title: "Alertas custom", desc: "Notificações quando métricas mudam" },
                { icon: Repeat, title: "Agendamento flex", desc: "Diário, semanal ou mensal — você escolhe" },
                { icon: Calendar, title: "Histórico de reports", desc: "Acesse qualquer relatório passado" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <Icon size={16} className="text-jade shrink-0 mt-0.5" strokeWidth={1.4} />
                    <div>
                      <h4 className="font-display font-bold text-[12px] text-white mb-0.5 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-ghost leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
