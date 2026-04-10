"use client";

import { motion } from "framer-motion";
import { Reveal, Stagger, MotionItem } from "./motion";
import { cn } from "@/lib/utils";

const integrations = [
  { name: "WordPress", category: "CMS", desc: "Plugin one-click, zero config" },
  { name: "Shopify", category: "E-commerce", desc: "Tracking automático de vendas" },
  { name: "Next.js", category: "Framework", desc: "Componente React nativo" },
  { name: "Webflow", category: "No-code", desc: "Custom code snippet" },
  { name: "Slack", category: "Comunicação", desc: "Alertas e relatórios no canal" },
  { name: "Zapier", category: "Automação", desc: "Conecte a 5000+ apps" },
  { name: "Segment", category: "CDP", desc: "Data pipeline bidirecional" },
  { name: "Vercel", category: "Deploy", desc: "Analytics edge-native" },
  { name: "Stripe", category: "Pagamentos", desc: "Atribuição de receita" },
  { name: "HubSpot", category: "CRM", desc: "Sync de leads e eventos" },
  { name: "Notion", category: "Docs", desc: "Dashboards embeddable" },
  { name: "BigQuery", category: "Data", desc: "Export automático de dados" },
];

const initials: Record<string, string> = {
  WordPress: "W", Shopify: "S", "Next.js": "N", Webflow: "Wf",
  Slack: "Sl", Zapier: "Z", Segment: "Sg", Vercel: "V",
  Stripe: "St", HubSpot: "H", Notion: "No", BigQuery: "BQ",
};

const colors: Record<string, string> = {
  WordPress: "bg-sapphire/10 text-sapphire border-sapphire/20",
  Shopify: "bg-jade/10 text-jade border-jade/20",
  "Next.js": "bg-white/10 text-white border-white/20",
  Webflow: "bg-sapphire/10 text-sapphire border-sapphire/20",
  Slack: "bg-gold/10 text-gold border-gold/20",
  Zapier: "bg-ember/10 text-ember border-ember/20",
  Segment: "bg-jade/10 text-jade border-jade/20",
  Vercel: "bg-white/10 text-white border-white/20",
  Stripe: "bg-sapphire/10 text-sapphire border-sapphire/20",
  HubSpot: "bg-ember/10 text-ember border-ember/20",
  Notion: "bg-white/10 text-white border-white/20",
  BigQuery: "bg-sapphire/10 text-sapphire border-sapphire/20",
};

export default function Integrations() {
  return (
    <section id="integracoes" className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <Reveal className="max-w-2xl mx-auto text-center mb-16">
          <span className="inline-block text-[11px] font-mono text-jade uppercase tracking-[0.15em] mb-4">
            Integrações
          </span>
          <h2 className="font-display font-extrabold text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-tight text-white mb-5">
            Conecta com tudo que{" "}
            <span className="text-jade">você já usa.</span>
          </h2>
          <p className="text-base text-ghost leading-relaxed">
            WordPress, Shopify, Next.js, Webflow. Plugins nativos, SDKs e APIs REST.
            Em 2 minutos sua stack está conectada.
          </p>
        </Reveal>

        {/* Integration grid */}
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {integrations.map((int) => (
            <MotionItem key={int.name}>
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-9 h-9 rounded-lg border flex items-center justify-center", colors[int.name])}>
                    <span className="text-[11px] font-mono font-bold">{initials[int.name]}</span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-display font-bold text-white tracking-tight">{int.name}</h4>
                    <span className="text-[10px] font-mono text-ghost/40">{int.category}</span>
                  </div>
                </div>
                <p className="text-[11px] text-ghost leading-relaxed">{int.desc}</p>
              </motion.div>
            </MotionItem>
          ))}
        </Stagger>

        {/* API callout */}
        <Reveal delay={0.2}>
          <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-[15px] text-white mb-1 tracking-tight">
                API REST completa
              </h4>
              <p className="text-[13px] text-ghost">
                Não encontrou sua ferramenta? Use nossa API para construir qualquer integração.
                Documentação completa com exemplos em 6 linguagens.
              </p>
            </div>
            <a
              href="#"
              className="shrink-0 px-5 py-2.5 rounded-lg border border-white/[0.08] text-ghost hover:text-white hover:border-white/[0.15] font-mono text-[12px] transition-all duration-200"
            >
              Ver documentação →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
