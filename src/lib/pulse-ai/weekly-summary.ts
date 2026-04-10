/**
 * Pulse AI — Weekly Summary Engine
 *
 * Generates automatic weekly/monthly summaries
 * for email and WhatsApp delivery.
 */

import { getKPIs, getTopPages, getTrafficSources, getCampaigns } from "./analytics-data";

export type SummaryFrequency = "daily" | "weekly" | "biweekly" | "monthly";
export type DeliveryChannel = "email" | "whatsapp" | "slack";

export interface SummaryConfig {
  id: string;
  name: string;
  frequency: SummaryFrequency;
  channels: DeliveryChannel[];
  recipients: string[];
  dayOfWeek: number; // 0=Sunday
  timeOfDay: string; // HH:MM
  includeInsights: boolean;
  includeRecommendations: boolean;
  includeComparison: boolean;
  enabled: boolean;
  lastSent?: string;
  nextScheduled: string;
}

export interface WeeklySummary {
  period: string;
  generatedAt: string;
  highlights: SummaryHighlight[];
  kpiSnapshot: SummaryKPI[];
  topContent: SummaryContent[];
  channelPerformance: SummaryChannel[];
  aiInsights: string[];
  recommendations: string[];
  overallScore: number; // 0-100
  trend: "improving" | "stable" | "declining";
}

export interface SummaryHighlight {
  emoji: string;
  text: string;
  impact: "positive" | "negative" | "neutral";
}

export interface SummaryKPI {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
}

export interface SummaryContent {
  title: string;
  path: string;
  views: number;
  change: number;
}

export interface SummaryChannel {
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
}

export function generateWeeklySummary(): WeeklySummary {
  const kpis = getKPIs();
  const pages = getTopPages();
  const sources = getTrafficSources();
  const campaigns = getCampaigns();

  const overallScore = calculateOverallScore(kpis);

  return {
    period: "31 Mar — 06 Abr 2026",
    generatedAt: new Date().toISOString(),
    highlights: [
      {
        emoji: "📈",
        text: `Visitantes subiram ${kpis[0].change}% — novo recorde de ${kpis[0].value}`,
        impact: "positive",
      },
      {
        emoji: "💰",
        text: `Receita cresceu ${kpis[5].change}% atingindo ${kpis[5].value}`,
        impact: "positive",
      },
      {
        emoji: "🎯",
        text: `${kpis[4].value} conversões (+${kpis[4].change}%) — acima da meta`,
        impact: "positive",
      },
      {
        emoji: "⚠️",
        text: `Bounce rate mobile em ${kpis[2].value} — atenção necessária`,
        impact: "negative",
      },
      {
        emoji: "🔍",
        text: `Google Organic lidera com ${sources[0].percentage}% do tráfego`,
        impact: "neutral",
      },
    ],
    kpiSnapshot: kpis.map((k) => ({
      label: k.label,
      value: k.value,
      change: k.change,
      trend: k.change > 2 ? "up" : k.change < -2 ? "down" : "stable",
    })),
    topContent: pages.slice(0, 5).map((p) => ({
      title: p.title,
      path: p.path,
      views: p.views,
      change: p.change,
    })),
    channelPerformance: sources.map((s) => ({
      name: s.name,
      visitors: s.visitors,
      conversions: s.conversions,
      conversionRate: s.conversionRate,
    })),
    aiInsights: [
      "O conteúdo educacional (blog) é o principal driver de crescimento orgânico.",
      `Email Marketing tem o melhor ROI com ${sources[3].conversionRate}% de conversão.`,
      "A experiência mobile precisa de otimização urgente — está custando conversões.",
      `A campanha "${campaigns[0].name}" via ${campaigns[0].source} é a mais eficiente.`,
    ],
    recommendations: [
      "Publique 2-3 artigos de blog por semana sobre analytics e privacidade.",
      "Otimize as Core Web Vitals no mobile para reduzir o bounce rate em 15%.",
      "Aumente o investimento em Email Marketing em 30% — canal mais eficiente.",
      "Pause campanhas com ROI negativo e realoque para canais performantes.",
      "Adicione CTAs internos nas páginas de blog para direcionar ao /pricing.",
    ],
    overallScore,
    trend: overallScore > 70 ? "improving" : overallScore > 50 ? "stable" : "declining",
  };
}

function calculateOverallScore(kpis: ReturnType<typeof getKPIs>): number {
  const weights = [0.2, 0.1, 0.15, 0.15, 0.25, 0.15];
  let score = 50;
  kpis.forEach((kpi, i) => {
    const impact = kpi.label === "Bounce Rate" ? -kpi.change : kpi.change;
    score += impact * weights[i];
  });
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getDefaultSummaryConfigs(): SummaryConfig[] {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));
  nextMonday.setHours(9, 0, 0, 0);

  return [
    {
      id: "weekly-default",
      name: "Resumo Semanal",
      frequency: "weekly",
      channels: ["email"],
      recipients: ["voce@empresa.com"],
      dayOfWeek: 1,
      timeOfDay: "09:00",
      includeInsights: true,
      includeRecommendations: true,
      includeComparison: true,
      enabled: true,
      lastSent: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextScheduled: nextMonday.toISOString(),
    },
    {
      id: "monthly-exec",
      name: "Relatório Mensal Executivo",
      frequency: "monthly",
      channels: ["email"],
      recipients: ["ceo@empresa.com", "cmo@empresa.com"],
      dayOfWeek: 1,
      timeOfDay: "08:00",
      includeInsights: true,
      includeRecommendations: true,
      includeComparison: true,
      enabled: true,
      nextScheduled: new Date(now.getFullYear(), now.getMonth() + 1, 1, 8, 0).toISOString(),
    },
    {
      id: "whatsapp-alert",
      name: "Alerta WhatsApp Diário",
      frequency: "daily",
      channels: ["whatsapp"],
      recipients: ["+55 11 99999-9999"],
      dayOfWeek: -1,
      timeOfDay: "18:00",
      includeInsights: false,
      includeRecommendations: false,
      includeComparison: false,
      enabled: false,
      nextScheduled: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0).toISOString(),
    },
  ];
}

export function formatWhatsAppSummary(summary: WeeklySummary): string {
  const lines = [
    `📊 *ClarityPulse — Resumo Semanal*`,
    `📅 ${summary.period}`,
    ``,
    `🏆 Score Geral: *${summary.overallScore}/100* (${summary.trend === "improving" ? "↑ Melhorando" : summary.trend === "stable" ? "→ Estável" : "↓ Atenção"})`,
    ``,
    `📌 *Destaques:*`,
    ...summary.highlights.map((h) => `${h.emoji} ${h.text}`),
    ``,
    `📊 *KPIs:*`,
    ...summary.kpiSnapshot.map((k) => `• ${k.label}: *${k.value}* (${k.change > 0 ? "+" : ""}${k.change}%)`),
    ``,
    `💡 *Recomendação #1:*`,
    summary.recommendations[0],
  ];
  return lines.join("\n");
}

export function formatEmailSummary(summary: WeeklySummary): string {
  return `
    <h2>Resumo Semanal — ${summary.period}</h2>
    <p>Score Geral: <strong>${summary.overallScore}/100</strong></p>
    <h3>Destaques</h3>
    <ul>${summary.highlights.map((h) => `<li>${h.emoji} ${h.text}</li>`).join("")}</ul>
    <h3>Recomendações</h3>
    <ol>${summary.recommendations.map((r) => `<li>${r}</li>`).join("")}</ol>
  `;
}
