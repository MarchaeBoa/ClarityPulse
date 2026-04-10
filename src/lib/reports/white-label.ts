/**
 * ClarityPulse — White-Label Report Generator
 *
 * Generate branded PDF reports for clients.
 * Supports custom logos, colors, and branding.
 */

import { getKPIs, getTopPages, getTrafficSources, getCampaigns } from "../pulse-ai/analytics-data";
import { generateRecommendations } from "../pulse-ai/recommendations";

export interface BrandConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  tagline: string;
  contactEmail: string;
  website: string;
  showPoweredBy: boolean;
}

export interface ReportSection {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

export interface ReportConfig {
  id: string;
  name: string;
  brand: BrandConfig;
  sections: ReportSection[];
  period: string;
  clientName: string;
  includeAI: boolean;
  includeRecommendations: boolean;
  format: "pdf" | "html" | "email";
  template: "executive" | "detailed" | "minimal";
  lastGenerated?: string;
}

export interface GeneratedReport {
  id: string;
  config: ReportConfig;
  generatedAt: string;
  sections: ReportSectionData[];
  summary: string;
}

export interface ReportSectionData {
  id: string;
  title: string;
  content: string;
  metrics?: { label: string; value: string; change?: number }[];
  chartType?: "line" | "bar" | "pie" | "table";
  tableData?: Record<string, string | number>[];
}

export function getDefaultBrand(): BrandConfig {
  return {
    companyName: "Sua Agência",
    logoUrl: "",
    primaryColor: "#1AE5A0",
    secondaryColor: "#3B7BF8",
    accentColor: "#0A0B0D",
    fontFamily: "Inter, sans-serif",
    tagline: "Analytics & Growth",
    contactEmail: "contato@suaagencia.com",
    website: "www.suaagencia.com",
    showPoweredBy: false,
  };
}

export function getDefaultSections(): ReportSection[] {
  return [
    { id: "executive-summary", title: "Resumo Executivo", enabled: true, order: 1 },
    { id: "kpi-overview", title: "KPIs Principais", enabled: true, order: 2 },
    { id: "traffic-analysis", title: "Análise de Tráfego", enabled: true, order: 3 },
    { id: "channel-breakdown", title: "Performance por Canal", enabled: true, order: 4 },
    { id: "top-pages", title: "Top Páginas", enabled: true, order: 5 },
    { id: "conversion-analysis", title: "Análise de Conversões", enabled: true, order: 6 },
    { id: "campaign-performance", title: "Performance de Campanhas", enabled: true, order: 7 },
    { id: "ai-insights", title: "Insights de IA", enabled: true, order: 8 },
    { id: "recommendations", title: "Recomendações", enabled: true, order: 9 },
    { id: "next-steps", title: "Próximos Passos", enabled: true, order: 10 },
  ];
}

export function getReportTemplates(): ReportConfig[] {
  const brand = getDefaultBrand();
  const sections = getDefaultSections();

  return [
    {
      id: "tpl-executive",
      name: "Relatório Executivo",
      brand,
      sections: sections.filter((s) => ["executive-summary", "kpi-overview", "recommendations", "next-steps"].includes(s.id)),
      period: "Últimos 30 dias",
      clientName: "Cliente Exemplo",
      includeAI: true,
      includeRecommendations: true,
      format: "pdf",
      template: "executive",
    },
    {
      id: "tpl-detailed",
      name: "Relatório Detalhado",
      brand,
      sections,
      period: "Últimos 30 dias",
      clientName: "Cliente Exemplo",
      includeAI: true,
      includeRecommendations: true,
      format: "pdf",
      template: "detailed",
    },
    {
      id: "tpl-minimal",
      name: "Resumo Rápido",
      brand,
      sections: sections.filter((s) => ["kpi-overview", "top-pages", "channel-breakdown"].includes(s.id)),
      period: "Últimos 7 dias",
      clientName: "Cliente Exemplo",
      includeAI: false,
      includeRecommendations: false,
      format: "email",
      template: "minimal",
    },
  ];
}

export function generateReport(config: ReportConfig): GeneratedReport {
  const kpis = getKPIs();
  const pages = getTopPages();
  const sources = getTrafficSources();
  const campaigns = getCampaigns();
  const recommendations = config.includeRecommendations ? generateRecommendations() : [];

  const sections: ReportSectionData[] = [];

  for (const section of config.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order)) {
    switch (section.id) {
      case "executive-summary":
        sections.push({
          id: section.id,
          title: section.title,
          content: `No período de ${config.period}, o site ${config.clientName} apresentou crescimento consistente em todas as métricas principais. Os visitantes únicos atingiram ${kpis[0].value} (+${kpis[0].change}%), com ${kpis[4].value} conversões (+${kpis[4].change}%) gerando ${kpis[5].value} em receita (+${kpis[5].change}%). O principal driver de crescimento foi o tráfego orgânico, que representa ${sources[0].percentage}% do total. A experiência mobile continua sendo o principal ponto de atenção, com bounce rate de ${kpis[2].value}.`,
        });
        break;

      case "kpi-overview":
        sections.push({
          id: section.id,
          title: section.title,
          content: "Visão geral dos indicadores-chave de performance do período.",
          metrics: kpis.map((k) => ({ label: k.label, value: k.value, change: k.change })),
          chartType: "bar",
        });
        break;

      case "traffic-analysis":
        sections.push({
          id: section.id,
          title: section.title,
          content: `O tráfego total cresceu ${kpis[0].change}%, de ${kpis[0].previous} para ${kpis[0].value} visitantes únicos. As pageviews atingiram ${kpis[1].value} (+${kpis[1].change}%), indicando que cada visitante está explorando mais páginas.`,
          chartType: "line",
        });
        break;

      case "channel-breakdown":
        sections.push({
          id: section.id,
          title: section.title,
          content: "Distribuição de tráfego e conversões por canal de aquisição.",
          chartType: "pie",
          tableData: sources.map((s) => ({
            Canal: s.name,
            Visitantes: s.visitors,
            "% Tráfego": `${s.percentage}%`,
            Conversões: s.conversions,
            "Taxa Conv.": `${s.conversionRate}%`,
          })),
        });
        break;

      case "top-pages":
        sections.push({
          id: section.id,
          title: section.title,
          content: "As páginas com melhor performance no período.",
          chartType: "table",
          tableData: pages.slice(0, 7).map((p) => ({
            Página: p.title,
            Path: p.path,
            Views: p.views,
            "Variação": `${p.change > 0 ? "+" : ""}${p.change}%`,
            "Tempo Médio": p.avgTime,
            "Bounce Rate": `${p.bounceRate}%`,
          })),
        });
        break;

      case "conversion-analysis":
        sections.push({
          id: section.id,
          title: section.title,
          content: `As conversões atingiram ${kpis[4].value} (+${kpis[4].change}%), com taxa média de conversão de 7.5%. O canal com melhor conversão é ${sources[5].name} (${sources[5].conversionRate}%), seguido por ${sources[3].name} (${sources[3].conversionRate}%).`,
          metrics: [
            { label: "Total de Conversões", value: kpis[4].value, change: kpis[4].change },
            { label: "Taxa de Conversão", value: "7.5%", change: 8.7 },
            { label: "Receita Total", value: kpis[5].value, change: kpis[5].change },
          ],
        });
        break;

      case "campaign-performance":
        sections.push({
          id: section.id,
          title: section.title,
          content: `${campaigns.length} campanhas ativas no período.`,
          chartType: "table",
          tableData: campaigns.map((c) => ({
            Campanha: c.name,
            Fonte: `${c.source}/${c.medium}`,
            Visitantes: c.visitors,
            Conversões: c.conversions,
            "Conv. Rate": `${c.conversionRate}%`,
            Receita: `$${c.revenue.toLocaleString()}`,
            Variação: `${c.change > 0 ? "+" : ""}${c.change}%`,
          })),
        });
        break;

      case "ai-insights":
        sections.push({
          id: section.id,
          title: section.title,
          content: "Insights gerados automaticamente pela IA com base nos dados do período.",
          metrics: [
            { label: "Insight Principal", value: "Conteúdo educacional é o maior driver de SEO" },
            { label: "Alerta", value: "Mobile precisa de otimização urgente" },
            { label: "Oportunidade", value: "Email Marketing pode dobrar conversões" },
          ],
        });
        break;

      case "recommendations":
        sections.push({
          id: section.id,
          title: section.title,
          content: "Recomendações acionáveis baseadas na análise dos dados.",
          tableData: recommendations.slice(0, 5).map((r, i) => ({
            "#": i + 1,
            Ação: r.title,
            Impacto: r.estimatedImpact,
            Esforço: r.effort === "low" ? "Baixo" : r.effort === "medium" ? "Médio" : "Alto",
            Prazo: r.timeToImplement,
          })),
        });
        break;

      case "next-steps":
        sections.push({
          id: section.id,
          title: section.title,
          content: `Para o próximo período, recomendamos focar em: 1) Otimização da performance mobile para reduzir o bounce rate; 2) Escalamento do Email Marketing como canal principal; 3) Produção de conteúdo SEO sobre analytics e privacidade; 4) Pausa de campanhas com ROI negativo e realocação de budget.`,
        });
        break;
    }
  }

  return {
    id: `report-${Date.now()}`,
    config,
    generatedAt: new Date().toISOString(),
    sections,
    summary: `Relatório "${config.name}" gerado com sucesso para ${config.clientName}. ${sections.length} seções incluídas.`,
  };
}

export function getGeneratedReports(): { id: string; name: string; client: string; date: string; format: string; template: string }[] {
  return [
    { id: "rpt-1", name: "Relatório Mensal — Março 2026", client: "TechStore Brasil", date: "2026-04-01", format: "PDF", template: "Detalhado" },
    { id: "rpt-2", name: "Resumo Semanal — Semana 14", client: "Edu Academy", date: "2026-04-07", format: "PDF", template: "Executivo" },
    { id: "rpt-3", name: "Relatório Mensal — Março 2026", client: "FinApp Pro", date: "2026-04-01", format: "PDF", template: "Detalhado" },
    { id: "rpt-4", name: "Resumo Rápido — Semana 14", client: "Clínica Vida", date: "2026-04-07", format: "Email", template: "Minimal" },
    { id: "rpt-5", name: "Relatório Q1 2026", client: "TechStore Brasil", date: "2026-04-02", format: "PDF", template: "Executivo" },
  ];
}
