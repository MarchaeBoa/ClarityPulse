/**
 * Pulse AI — Enhanced Insights Engine
 *
 * Generates natural language insights from analytics data.
 * Detects trends, anomalies, opportunities, and problems
 * using pattern recognition on time-series data.
 */

import {
  getKPIs,
  getTopPages,
  getTrafficSources,
  getCampaigns,
  getAudienceByDevice,
  getDailyTraffic,
} from "./analytics-data";

export interface NaturalInsight {
  id: string;
  type: "trend_up" | "trend_down" | "alert" | "opportunity" | "achievement" | "warning";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  metric: string;
  value: string;
  change: number;
  category: "traffic" | "conversion" | "engagement" | "content" | "campaign" | "audience";
  actionable: boolean;
  suggestion?: string;
  timestamp: string;
}

function generateTimestamp(hoursAgo: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

export function generateNaturalInsights(): NaturalInsight[] {
  const kpis = getKPIs();
  const pages = getTopPages();
  const sources = getTrafficSources();
  const campaigns = getCampaigns();
  const devices = getAudienceByDevice();
  const daily = getDailyTraffic();

  const insights: NaturalInsight[] = [];

  // 1. Conversion drop/rise detection
  const convKpi = kpis[4];
  if (Math.abs(convKpi.change) > 10) {
    const isDown = convKpi.change < 0;
    insights.push({
      id: "conv-change",
      type: isDown ? "alert" : "achievement",
      severity: Math.abs(convKpi.change) > 20 ? "critical" : "high",
      title: isDown
        ? `Sua conversão caiu ${Math.abs(convKpi.change)}%`
        : `Suas conversões subiram ${convKpi.change}%!`,
      message: isDown
        ? `As conversões caíram de ${convKpi.previous} para ${convKpi.value} nos últimos 30 dias. Isso pode indicar problemas na experiência do usuário ou nas campanhas.`
        : `Excelente! Conversões saltaram de ${convKpi.previous} para ${convKpi.value}. O crescimento está acima da média do setor (8-12%).`,
      metric: "Conversões",
      value: convKpi.value,
      change: convKpi.change,
      category: "conversion",
      actionable: true,
      suggestion: isDown
        ? "Revise o funil de conversão e verifique se houve mudanças recentes nas landing pages."
        : "Continue investindo nos canais que estão performando melhor.",
      timestamp: generateTimestamp(1),
    });
  }

  // 2. Revenue insight
  const revKpi = kpis[5];
  insights.push({
    id: "rev-growth",
    type: revKpi.change > 0 ? "trend_up" : "trend_down",
    severity: revKpi.change > 15 ? "high" : "medium",
    title: `Receita ${revKpi.change > 0 ? "cresceu" : "caiu"} ${Math.abs(revKpi.change)}%`,
    message: `A receita foi de ${revKpi.previous} para ${revKpi.value}. ${
      revKpi.change > 0
        ? "O crescimento está sendo impulsionado pelo aumento nas conversões e no ticket médio."
        : "A queda está correlacionada com a redução nas conversões de canais pagos."
    }`,
    metric: "Receita",
    value: revKpi.value,
    change: revKpi.change,
    category: "conversion",
    actionable: revKpi.change < 0,
    suggestion: revKpi.change < 0
      ? "Analise o ticket médio por canal e considere ofertas para recuperar conversões."
      : undefined,
    timestamp: generateTimestamp(2),
  });

  // 3. Mobile bounce rate alert
  const mobile = devices[1];
  const desktop = devices[0];
  if (mobile.bounceRate - desktop.bounceRate > 10) {
    insights.push({
      id: "mobile-bounce",
      type: "warning",
      severity: "high",
      title: `Mobile com bounce rate ${(mobile.bounceRate - desktop.bounceRate).toFixed(0)}% maior que desktop`,
      message: `O bounce rate no mobile (${mobile.bounceRate}%) é significativamente maior que no desktop (${desktop.bounceRate}%). Você está perdendo aproximadamente ${Math.floor(mobile.visitors * 0.15)} visitantes por mês por causa disso.`,
      metric: "Bounce Rate Mobile",
      value: `${mobile.bounceRate}%`,
      change: mobile.bounceRate - desktop.bounceRate,
      category: "audience",
      actionable: true,
      suggestion: "Priorize otimizações de performance mobile: reduza o tempo de carregamento para < 3s e simplifique a navegação.",
      timestamp: generateTimestamp(3),
    });
  }

  // 4. Top growing page
  const topGrowth = [...pages].sort((a, b) => b.change - a.change)[0];
  if (topGrowth.change > 30) {
    insights.push({
      id: "page-growth",
      type: "trend_up",
      severity: "medium",
      title: `"${topGrowth.title}" explodiu com +${topGrowth.change}%`,
      message: `A página "${topGrowth.title}" (${topGrowth.path}) teve um crescimento de ${topGrowth.change}% nas visualizações, atingindo ${topGrowth.views.toLocaleString()} views com apenas ${topGrowth.bounceRate}% de bounce rate.`,
      metric: "Pageviews",
      value: topGrowth.views.toLocaleString(),
      change: topGrowth.change,
      category: "content",
      actionable: true,
      suggestion: "Crie mais conteúdo similar e adicione CTAs internos para converter esse tráfego.",
      timestamp: generateTimestamp(4),
    });
  }

  // 5. Best converting source
  const bestSource = [...sources].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  insights.push({
    id: "best-source",
    type: "opportunity",
    severity: "high",
    title: `${bestSource.name} converte ${bestSource.conversionRate}% — seu melhor canal`,
    message: `${bestSource.name} tem a maior taxa de conversão (${bestSource.conversionRate}%) mas representa apenas ${bestSource.percentage}% do tráfego total. Há uma oportunidade clara de escalar este canal.`,
    metric: "Taxa de Conversão",
    value: `${bestSource.conversionRate}%`,
    change: bestSource.conversionRate,
    category: "traffic",
    actionable: true,
    suggestion: `Aumente o investimento em ${bestSource.name} em 30-50%. O ROI estimado é superior aos outros canais.`,
    timestamp: generateTimestamp(5),
  });

  // 6. Worst campaign alert
  const worstCampaign = [...campaigns].sort((a, b) => a.change - b.change)[0];
  if (worstCampaign.change < 0) {
    insights.push({
      id: "worst-campaign",
      type: "alert",
      severity: "high",
      title: `Campanha "${worstCampaign.name}" caiu ${Math.abs(worstCampaign.change)}%`,
      message: `A campanha "${worstCampaign.name}" (${worstCampaign.source}/${worstCampaign.medium}) teve queda de ${Math.abs(worstCampaign.change)}% nas conversões. Taxa de conversão atual: ${worstCampaign.conversionRate}%. Receita: $${worstCampaign.revenue.toLocaleString()}.`,
      metric: "Performance da Campanha",
      value: `${worstCampaign.conversionRate}%`,
      change: worstCampaign.change,
      category: "campaign",
      actionable: true,
      suggestion: "Considere pausar esta campanha e redistribuir o orçamento para campanhas com melhor ROI.",
      timestamp: generateTimestamp(6),
    });
  }

  // 7. Traffic milestone
  const visitorKpi = kpis[0];
  insights.push({
    id: "traffic-record",
    type: "achievement",
    severity: "medium",
    title: `Novo recorde: ${visitorKpi.value} visitantes únicos!`,
    message: `Você atingiu ${visitorKpi.value} visitantes únicos este mês, um crescimento de ${visitorKpi.change}% em relação ao período anterior (${visitorKpi.previous}). Continue assim!`,
    metric: "Visitantes Únicos",
    value: visitorKpi.value,
    change: visitorKpi.change,
    category: "traffic",
    actionable: false,
    timestamp: generateTimestamp(8),
  });

  // 8. Session duration insight
  const durationKpi = kpis[3];
  insights.push({
    id: "session-duration",
    type: durationKpi.change > 0 ? "trend_up" : "trend_down",
    severity: "low",
    title: `Tempo médio de sessão ${durationKpi.change > 0 ? "aumentou" : "diminuiu"} ${Math.abs(durationKpi.change)}%`,
    message: `A duração média das sessões foi de ${durationKpi.previous} para ${durationKpi.value}. ${
      durationKpi.change > 0
        ? "Isso indica que os visitantes estão encontrando conteúdo relevante e engajando mais."
        : "Pode indicar que o conteúdo não está atendendo as expectativas dos visitantes."
    }`,
    metric: "Duração Média",
    value: durationKpi.value,
    change: durationKpi.change,
    category: "engagement",
    actionable: durationKpi.change < 0,
    suggestion: durationKpi.change < 0
      ? "Revise a qualidade do conteúdo e adicione elementos interativos para aumentar o engajamento."
      : undefined,
    timestamp: generateTimestamp(10),
  });

  // 9. Weekend traffic pattern
  const weekendTraffic = daily.filter((d) => {
    const day = new Date(d.date).getDay();
    return day === 0 || day === 6;
  });
  const weekdayTraffic = daily.filter((d) => {
    const day = new Date(d.date).getDay();
    return day !== 0 && day !== 6;
  });
  const avgWeekend = weekendTraffic.reduce((s, d) => s + d.visitors, 0) / (weekendTraffic.length || 1);
  const avgWeekday = weekdayTraffic.reduce((s, d) => s + d.visitors, 0) / (weekdayTraffic.length || 1);
  const weekendDrop = Math.round((1 - avgWeekend / avgWeekday) * 100);

  if (weekendDrop > 20) {
    insights.push({
      id: "weekend-pattern",
      type: "warning",
      severity: "low",
      title: `Tráfego cai ${weekendDrop}% nos finais de semana`,
      message: `Nos fins de semana, seu tráfego médio é ${Math.round(avgWeekend)} visitantes/dia vs ${Math.round(avgWeekday)} em dias úteis. Considere programar conteúdo social para manter o engajamento.`,
      metric: "Padrão Semanal",
      value: `-${weekendDrop}%`,
      change: -weekendDrop,
      category: "traffic",
      actionable: true,
      suggestion: "Agende posts em redes sociais para sábado/domingo e considere campanhas de email no domingo à noite.",
      timestamp: generateTimestamp(12),
    });
  }

  return insights.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export function getInsightsSummary(): string {
  const insights = generateNaturalInsights();
  const critical = insights.filter((i) => i.severity === "critical");
  const high = insights.filter((i) => i.severity === "high");

  if (critical.length > 0) {
    return `${critical.length} alerta(s) crítico(s) encontrado(s). Ação imediata recomendada.`;
  }
  if (high.length > 0) {
    return `${high.length} insight(s) importante(s) detectado(s). Revise para otimizar resultados.`;
  }
  return "Tudo parece estar dentro do esperado. Continue monitorando.";
}
