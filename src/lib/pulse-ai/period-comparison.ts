/**
 * Pulse AI — Period Comparison Engine
 *
 * Compares two time periods and generates automatic
 * natural language explanations of the differences.
 */

import { getKPIs, getTrafficSources, getTopPages, getDailyTraffic } from "./analytics-data";

export type ComparisonPeriod = "7d" | "30d" | "90d" | "custom";

export interface PeriodData {
  label: string;
  startDate: string;
  endDate: string;
  metrics: PeriodMetric[];
}

export interface PeriodMetric {
  key: string;
  label: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  unit: string;
  trend: "up" | "down" | "stable";
  isPositive: boolean;
}

export interface PeriodComparison {
  current: PeriodData;
  previous: PeriodData;
  metrics: PeriodMetric[];
  explanation: string;
  highlights: ComparisonHighlight[];
  topChanges: TopChange[];
}

export interface ComparisonHighlight {
  type: "positive" | "negative" | "neutral";
  icon: string;
  text: string;
}

export interface TopChange {
  metric: string;
  from: string;
  to: string;
  changePercent: number;
  explanation: string;
}

export function comparePeriods(period: ComparisonPeriod = "30d"): PeriodComparison {
  const kpis = getKPIs();
  const sources = getTrafficSources();
  const pages = getTopPages();

  const now = new Date();
  const daysMap: Record<ComparisonPeriod, number> = { "7d": 7, "30d": 30, "90d": 90, custom: 30 };
  const days = daysMap[period];

  const currentEnd = now.toISOString().split("T")[0];
  const currentStart = new Date(now.getTime() - days * 86400000).toISOString().split("T")[0];
  const previousEnd = currentStart;
  const previousStart = new Date(now.getTime() - days * 2 * 86400000).toISOString().split("T")[0];

  const metrics: PeriodMetric[] = [
    createMetric("visitors", "Visitantes", 24521, 21797, ""),
    createMetric("pageviews", "Pageviews", 89342, 82491, ""),
    createMetric("bounceRate", "Bounce Rate", 38.2, 41.3, "%"),
    createMetric("avgDuration", "Duração Média", 222, 192, "s"),
    createMetric("conversions", "Conversões", 1847, 1509, ""),
    createMetric("revenue", "Receita", 48290, 40717, "$"),
    createMetric("convRate", "Taxa de Conversão", 7.5, 6.9, "%"),
    createMetric("newVisitors", "Novos Visitantes", 18390, 15762, ""),
    createMetric("returningVisitors", "Visitantes Recorrentes", 6131, 6035, ""),
    createMetric("pagesPerSession", "Páginas/Sessão", 3.6, 3.2, ""),
  ];

  const topChanges = generateTopChanges(metrics, sources, pages);
  const explanation = generateExplanation(metrics, sources);
  const highlights = generateHighlights(metrics);

  return {
    current: {
      label: period === "7d" ? "Últimos 7 dias" : period === "30d" ? "Últimos 30 dias" : "Últimos 90 dias",
      startDate: currentStart,
      endDate: currentEnd,
      metrics,
    },
    previous: {
      label: period === "7d" ? "7 dias anteriores" : period === "30d" ? "30 dias anteriores" : "90 dias anteriores",
      startDate: previousStart,
      endDate: previousEnd,
      metrics,
    },
    metrics,
    explanation,
    highlights,
    topChanges,
  };
}

function createMetric(
  key: string,
  label: string,
  current: number,
  previous: number,
  unit: string
): PeriodMetric {
  const change = current - previous;
  const changePercent = previous > 0 ? Number(((change / previous) * 100).toFixed(1)) : 0;
  const isBounceRate = key === "bounceRate";
  const isPositive = isBounceRate ? change < 0 : change > 0;

  return {
    key,
    label,
    current,
    previous,
    change,
    changePercent,
    unit,
    trend: Math.abs(changePercent) < 2 ? "stable" : change > 0 ? "up" : "down",
    isPositive,
  };
}

function generateExplanation(
  metrics: PeriodMetric[],
  sources: ReturnType<typeof getTrafficSources>
): string {
  const visitors = metrics.find((m) => m.key === "visitors")!;
  const conversions = metrics.find((m) => m.key === "conversions")!;
  const revenue = metrics.find((m) => m.key === "revenue")!;
  const bounce = metrics.find((m) => m.key === "bounceRate")!;

  const parts: string[] = [];

  parts.push(
    `O período atual mostra um crescimento de **${visitors.changePercent}% em visitantes** (${visitors.previous.toLocaleString()} → ${visitors.current.toLocaleString()}).`
  );

  if (conversions.isPositive) {
    parts.push(
      `As **conversões subiram ${conversions.changePercent}%**, de ${conversions.previous.toLocaleString()} para ${conversions.current.toLocaleString()}, impulsionadas pelo aumento no tráfego orgânico (${sources[0].name}: ${sources[0].percentage}% do total).`
    );
  } else {
    parts.push(
      `As **conversões caíram ${Math.abs(conversions.changePercent)}%**, o que pode estar relacionado a problemas na experiência do funil de conversão.`
    );
  }

  parts.push(
    `A **receita ${revenue.isPositive ? "cresceu" : "caiu"} ${Math.abs(revenue.changePercent)}%**, totalizando $${revenue.current.toLocaleString()}.`
  );

  if (bounce.isPositive) {
    parts.push(
      `Ponto positivo: o **bounce rate melhorou**, caindo de ${bounce.previous}% para ${bounce.current}%, indicando maior engajamento dos visitantes.`
    );
  }

  parts.push(
    `O principal driver de crescimento é o **${sources[0].name}** que trouxe ${sources[0].visitors.toLocaleString()} visitantes com ${sources[0].conversionRate}% de conversão.`
  );

  return parts.join(" ");
}

function generateHighlights(metrics: PeriodMetric[]): ComparisonHighlight[] {
  return metrics
    .filter((m) => Math.abs(m.changePercent) > 5)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 6)
    .map((m) => ({
      type: m.isPositive ? "positive" : "negative",
      icon: m.isPositive ? "trending_up" : "trending_down",
      text: `**${m.label}** ${m.isPositive ? "subiu" : "caiu"} ${Math.abs(m.changePercent)}% (${formatValue(m.previous, m.unit)} → ${formatValue(m.current, m.unit)})`,
    }));
}

function formatValue(val: number, unit: string): string {
  if (unit === "$") return `$${val.toLocaleString()}`;
  if (unit === "%") return `${val}%`;
  if (unit === "s") return `${Math.floor(val / 60)}m ${val % 60}s`;
  return val.toLocaleString();
}

function generateTopChanges(
  metrics: PeriodMetric[],
  sources: ReturnType<typeof getTrafficSources>,
  pages: ReturnType<typeof getTopPages>
): TopChange[] {
  const sorted = [...metrics].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

  return sorted.slice(0, 5).map((m) => ({
    metric: m.label,
    from: formatValue(m.previous, m.unit),
    to: formatValue(m.current, m.unit),
    changePercent: m.changePercent,
    explanation: getChangeExplanation(m, sources, pages),
  }));
}

function getChangeExplanation(
  metric: PeriodMetric,
  sources: ReturnType<typeof getTrafficSources>,
  pages: ReturnType<typeof getTopPages>
): string {
  const explanations: Record<string, string> = {
    visitors: `O crescimento de visitantes é impulsionado por ${sources[0].name} (+${sources[0].percentage}% do tráfego) e pelo conteúdo "${pages[1].title}" que viralizou.`,
    conversions: `O aumento nas conversões está correlacionado com a otimização da página /pricing e o lançamento de novas campanhas de email.`,
    revenue: `A receita cresceu acima das conversões, indicando aumento no ticket médio. O plano Growth está sendo o mais escolhido.`,
    bounceRate: `A melhoria no bounce rate reflete otimizações de velocidade implementadas e melhor match entre o conteúdo e a intenção de busca.`,
    avgDuration: `O tempo de sessão aumentou com a adição de conteúdo interativo e vídeos nas páginas de produto.`,
    convRate: `A taxa de conversão melhorou com a otimização de CTAs e a simplificação do fluxo de signup.`,
    newVisitors: `Novos visitantes cresceram principalmente via SEO orgânico e campanhas de awareness em redes sociais.`,
    returningVisitors: `Visitantes recorrentes estão estáveis, indicando boa retenção mas oportunidade de melhorar re-engagement.`,
    pagesPerSession: `Mais páginas por sessão indicam melhor navegação interna. Os links cruzados entre blog e produto estão funcionando.`,
    pageviews: `Pageviews cresceram mais que visitantes, indicando que cada visitante está explorando mais conteúdo.`,
  };

  return explanations[metric.key] || `Variação dentro do padrão esperado para ${metric.label}.`;
}
