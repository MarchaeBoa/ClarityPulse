/**
 * Pulse AI — Channel Benchmarks
 *
 * Compare channel performance against industry benchmarks.
 * Provides context on how each channel is performing
 * relative to SaaS averages.
 */

import { getTrafficSources, getCampaigns } from "./analytics-data";

export interface ChannelBenchmark {
  channel: string;
  metrics: {
    label: string;
    yours: number;
    industry: number;
    delta: number;
    status: "above" | "at" | "below";
    unit: string;
  }[];
  overallScore: number; // 0-100
  verdict: string;
}

export interface BenchmarkOverview {
  channels: ChannelBenchmark[];
  bestChannel: string;
  worstChannel: string;
  summary: string;
}

const industryBenchmarks: Record<string, Record<string, number>> = {
  "Google Organic": {
    conversionRate: 4.5,
    bounceRate: 42,
    avgSessionDuration: 180,
    pagesPerSession: 2.8,
    costPerConversion: 0,
  },
  "Direct": {
    conversionRate: 5.0,
    bounceRate: 38,
    avgSessionDuration: 210,
    pagesPerSession: 3.2,
    costPerConversion: 0,
  },
  "Social Media": {
    conversionRate: 2.5,
    bounceRate: 55,
    avgSessionDuration: 120,
    pagesPerSession: 1.8,
    costPerConversion: 8.5,
  },
  "Email Marketing": {
    conversionRate: 6.0,
    bounceRate: 30,
    avgSessionDuration: 240,
    pagesPerSession: 3.5,
    costPerConversion: 3.2,
  },
  "Referral": {
    conversionRate: 4.0,
    bounceRate: 40,
    avgSessionDuration: 190,
    pagesPerSession: 2.5,
    costPerConversion: 0,
  },
  "Paid Search": {
    conversionRate: 3.8,
    bounceRate: 45,
    avgSessionDuration: 160,
    pagesPerSession: 2.2,
    costPerConversion: 12.5,
  },
};

function getStatus(yours: number, industry: number, lowerIsBetter: boolean): "above" | "at" | "below" {
  const ratio = yours / industry;
  if (lowerIsBetter) {
    if (ratio < 0.9) return "above";
    if (ratio > 1.1) return "below";
    return "at";
  }
  if (ratio > 1.1) return "above";
  if (ratio < 0.9) return "below";
  return "at";
}

export function getChannelBenchmarks(): BenchmarkOverview {
  const sources = getTrafficSources();

  const channels: ChannelBenchmark[] = sources.map((source) => {
    const bench = industryBenchmarks[source.name] || industryBenchmarks["Direct"];

    const yourConvRate = source.conversionRate;
    const yourBounceRate = source.name === "Social Media" ? 52 : source.name === "Email Marketing" ? 28 : 38 + Math.floor(Math.random() * 10);
    const yourSessionDuration = source.name === "Email Marketing" ? 280 : source.name === "Paid Search" ? 195 : 180 + Math.floor(Math.random() * 60);
    const yourPagesPerSession = source.name === "Email Marketing" ? 4.1 : source.name === "Direct" ? 3.5 : 2.5 + Math.random();

    const metrics = [
      {
        label: "Taxa de Conversão",
        yours: yourConvRate,
        industry: bench.conversionRate,
        delta: Number(((yourConvRate - bench.conversionRate) / bench.conversionRate * 100).toFixed(1)),
        status: getStatus(yourConvRate, bench.conversionRate, false),
        unit: "%",
      },
      {
        label: "Bounce Rate",
        yours: yourBounceRate,
        industry: bench.bounceRate,
        delta: Number(((yourBounceRate - bench.bounceRate) / bench.bounceRate * 100).toFixed(1)),
        status: getStatus(yourBounceRate, bench.bounceRate, true),
        unit: "%",
      },
      {
        label: "Duração da Sessão",
        yours: yourSessionDuration,
        industry: bench.avgSessionDuration,
        delta: Number(((yourSessionDuration - bench.avgSessionDuration) / bench.avgSessionDuration * 100).toFixed(1)),
        status: getStatus(yourSessionDuration, bench.avgSessionDuration, false),
        unit: "s",
      },
      {
        label: "Páginas/Sessão",
        yours: Number(yourPagesPerSession.toFixed(1)),
        industry: bench.pagesPerSession,
        delta: Number(((yourPagesPerSession - bench.pagesPerSession) / bench.pagesPerSession * 100).toFixed(1)),
        status: getStatus(yourPagesPerSession, bench.pagesPerSession, false),
        unit: "",
      },
    ];

    const aboveCount = metrics.filter((m) => m.status === "above").length;
    const overallScore = Math.round((aboveCount / metrics.length) * 100);

    const verdicts: Record<string, string> = {
      "Google Organic": yourConvRate > bench.conversionRate
        ? "SEO está performando acima da média. Continue investindo em conteúdo de qualidade."
        : "SEO pode melhorar. Foque em conteúdo com intenção de compra.",
      "Direct": "Tráfego direto saudável indica boa brand awareness.",
      "Social Media": yourConvRate > bench.conversionRate
        ? "Social está convertendo acima do esperado. Escale os formatos que funcionam."
        : "Social precisa de landing pages mais otimizadas para conversão.",
      "Email Marketing": "Canal mais eficiente. Considere aumentar a frequência de envios.",
      "Referral": "Parcerias estão trazendo tráfego qualificado.",
      "Paid Search": yourConvRate > bench.conversionRate
        ? "Paid Search com excelente ROI. Aumente o budget gradualmente."
        : "Revise as keywords e landing pages das campanhas pagas.",
    };

    return {
      channel: source.name,
      metrics,
      overallScore,
      verdict: verdicts[source.name] || "Continue monitorando este canal.",
    };
  });

  const sorted = [...channels].sort((a, b) => b.overallScore - a.overallScore);
  const bestChannel = sorted[0].channel;
  const worstChannel = sorted[sorted.length - 1].channel;

  return {
    channels,
    bestChannel,
    worstChannel,
    summary: `${bestChannel} é seu canal com melhor performance geral, superando os benchmarks da indústria. ${worstChannel} precisa de atenção para atingir a média do mercado.`,
  };
}
