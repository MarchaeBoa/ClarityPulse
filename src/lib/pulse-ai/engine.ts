/**
 * Pulse AI — Query Engine
 *
 * Classifies user queries and generates structured responses
 * based on analytics data. In production, replace with Claude API
 * calls that receive the analytics context as structured data.
 */

import {
  getAnalyticsSummary,
  getTopPages,
  getTrafficSources,
  getCampaigns,
  getAudienceByDevice,
  getKPIs,
} from "./analytics-data";

export interface AIResponseSection {
  type: "text" | "metric" | "list" | "highlight" | "action";
  content: string;
  items?: string[];
  metrics?: { label: string; value: string; change?: number }[];
}

export interface AIResponse {
  sections: AIResponseSection[];
  category: "traffic" | "conversion" | "campaign" | "page" | "audience" | "action" | "summary";
  confidence: number;
}

type QueryCategory = AIResponse["category"];

function classifyQuery(query: string): QueryCategory {
  const q = query.toLowerCase();

  if (/a[cç][oõ]es|dicas|melhorar|aumentar|otimizar|recomenda|sugir|sugest/i.test(q)) return "action";
  if (/campanha|utm|campaign|anuncio|ads|paid|cpc/i.test(q)) return "campaign";
  if (/convers[aã]o|convert|signup|purchase|meta|goal|funil/i.test(q)) return "conversion";
  if (/p[aá]gina|page|blog|url|post|artigo|conte[uú]do/i.test(q)) return "page";
  if (/dispositivo|mobile|desktop|tablet|audiencia|audience|geo|pa[ií]s/i.test(q)) return "audience";
  if (/tr[aá]fego|traffic|visita|visitor|acesso|fonte|source|origem|refer/i.test(q)) return "traffic";
  if (/resum|summary|overview|geral|vis[aã]o|30 dias|semana|m[eê]s/i.test(q)) return "summary";

  return "summary";
}

function generateTrafficResponse(): AIResponse {
  const sources = getTrafficSources();
  const kpis = getKPIs();
  const visitorKpi = kpis[0];
  const top3 = sources.slice(0, 3);

  return {
    category: "traffic",
    confidence: 0.94,
    sections: [
      {
        type: "text",
        content: `Nos **últimos 30 dias**, seu site recebeu **${visitorKpi.value} visitantes únicos**, um crescimento de **${visitorKpi.change > 0 ? "+" : ""}${visitorKpi.change}%** em relação ao período anterior.`,
      },
      {
        type: "metric",
        content: "Principais métricas de tráfego",
        metrics: [
          { label: "Visitantes Únicos", value: visitorKpi.value, change: visitorKpi.change },
          { label: "Pageviews", value: kpis[1].value, change: kpis[1].change },
          { label: "Bounce Rate", value: kpis[2].value, change: kpis[2].change },
          { label: "Duração Média", value: kpis[3].value, change: kpis[3].change },
        ],
      },
      {
        type: "text",
        content: "Suas **top 3 fontes de tráfego** são:",
      },
      {
        type: "list",
        content: "Fontes de tráfego",
        items: top3.map(
          (s) =>
            `**${s.name}** — ${s.visitors.toLocaleString()} visitantes (${s.percentage}%) com taxa de conversão de ${s.conversionRate}%`
        ),
      },
      {
        type: "highlight",
        content: `💡 **Destaque:** ${sources[3].name} tem a melhor taxa de conversão (${sources[3].conversionRate}%) apesar de representar apenas ${sources[3].percentage}% do tráfego. Considere investir mais neste canal.`,
      },
    ],
  };
}

function generatePageResponse(): AIResponse {
  const pages = getTopPages();
  const topGrowth = [...pages].sort((a, b) => b.change - a.change).slice(0, 5);
  const bestPage = topGrowth[0];

  return {
    category: "page",
    confidence: 0.92,
    sections: [
      {
        type: "text",
        content: `A página com **maior crescimento** esta semana foi **"${bestPage.title}"** (${bestPage.path}) com um aumento de **+${bestPage.change}%** nas visualizações.`,
      },
      {
        type: "metric",
        content: `Métricas de "${bestPage.title}"`,
        metrics: [
          { label: "Visualizações", value: bestPage.views.toLocaleString(), change: bestPage.change },
          { label: "Tempo Médio", value: bestPage.avgTime },
          { label: "Bounce Rate", value: `${bestPage.bounceRate}%` },
        ],
      },
      {
        type: "text",
        content: "**Top 5 páginas por crescimento:**",
      },
      {
        type: "list",
        content: "Páginas com maior crescimento",
        items: topGrowth.map(
          (p, i) =>
            `**${i + 1}. ${p.title}** — ${p.views.toLocaleString()} views (+${p.change}%), bounce rate ${p.bounceRate}%`
        ),
      },
      {
        type: "highlight",
        content: `💡 **Insight:** Conteúdos de blog estão dominando o crescimento. As páginas "${topGrowth[0].title}" e "${topGrowth[1]?.title}" mostram que conteúdo educacional atrai tráfego qualificado com baixo bounce rate.`,
      },
    ],
  };
}

function generateCampaignResponse(): AIResponse {
  const campaigns = getCampaigns();
  const worst = [...campaigns].sort((a, b) => a.change - b.change)[0];
  const best = [...campaigns].sort((a, b) => b.change - a.change)[0];

  return {
    category: "campaign",
    confidence: 0.91,
    sections: [
      {
        type: "text",
        content: `Você tem **${campaigns.length} campanhas ativas**. A campanha com **pior desempenho** é **"${worst.name}"** com queda de **${worst.change}%** nas conversões.`,
      },
      {
        type: "metric",
        content: `Campanha "${worst.name}" (pior desempenho)`,
        metrics: [
          { label: "Visitantes", value: worst.visitors.toLocaleString(), change: worst.change },
          { label: "Conversões", value: worst.conversions.toLocaleString() },
          { label: "Taxa de Conversão", value: `${worst.conversionRate}%` },
          { label: "Receita", value: `$${worst.revenue.toLocaleString()}` },
        ],
      },
      {
        type: "text",
        content: `Em contraste, a **melhor campanha** é **"${best.name}"** com crescimento de **+${best.change}%**:`,
      },
      {
        type: "metric",
        content: `Campanha "${best.name}" (melhor desempenho)`,
        metrics: [
          { label: "Visitantes", value: best.visitors.toLocaleString(), change: best.change },
          { label: "Conversões", value: best.conversions.toLocaleString() },
          { label: "Taxa de Conversão", value: `${best.conversionRate}%` },
          { label: "Receita", value: `$${best.revenue.toLocaleString()}` },
        ],
      },
      {
        type: "highlight",
        content: `⚠️ **Atenção:** A campanha "${worst.name}" via ${worst.source}/${worst.medium} está com ROI negativo. Recomendo pausar e redistribuir o orçamento para "${best.name}" que tem ${best.conversionRate}% de conversão.`,
      },
    ],
  };
}

function generateConversionResponse(): AIResponse {
  const sources = getTrafficSources();
  const kpis = getKPIs();
  const convKpi = kpis[4];
  const revenueKpi = kpis[5];
  const topConverting = [...sources].sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 3);

  return {
    category: "conversion",
    confidence: 0.93,
    sections: [
      {
        type: "text",
        content: `Nos últimos 30 dias, você obteve **${convKpi.value} conversões** (+${convKpi.change}%) gerando **${revenueKpi.value} em receita** (+${revenueKpi.change}%).`,
      },
      {
        type: "metric",
        content: "Métricas de conversão",
        metrics: [
          { label: "Total de Conversões", value: convKpi.value, change: convKpi.change },
          { label: "Receita Total", value: revenueKpi.value, change: revenueKpi.change },
          { label: "Taxa Média", value: "7.5%" },
        ],
      },
      {
        type: "text",
        content: "Os **usuários que mais convertem** vêm de:",
      },
      {
        type: "list",
        content: "Fontes com maior conversão",
        items: topConverting.map(
          (s) =>
            `**${s.name}** — ${s.conversionRate}% de conversão (${s.conversions} conversões de ${s.visitors.toLocaleString()} visitantes)`
        ),
      },
      {
        type: "highlight",
        content: `💡 **Insight:** Paid Search e Email Marketing têm as maiores taxas de conversão (${topConverting[0].conversionRate}% e ${topConverting[1]?.conversionRate}%). Esses canais trazem visitantes com alta intenção de compra.`,
      },
    ],
  };
}

function generateAudienceResponse(): AIResponse {
  const devices = getAudienceByDevice();

  return {
    category: "audience",
    confidence: 0.90,
    sections: [
      {
        type: "text",
        content: `Sua audiência é composta majoritariamente por **usuários desktop (${devices[0].percentage}%)**, seguidos por **mobile (${devices[1].percentage}%)** e **tablet (${devices[2].percentage}%)**.`,
      },
      {
        type: "metric",
        content: "Comparativo Desktop vs Mobile",
        metrics: [
          { label: "Desktop — Visitantes", value: devices[0].visitors.toLocaleString() },
          { label: "Desktop — Bounce Rate", value: `${devices[0].bounceRate}%` },
          { label: "Desktop — Conversões", value: devices[0].conversions.toLocaleString() },
          { label: "Mobile — Visitantes", value: devices[1].visitors.toLocaleString() },
          { label: "Mobile — Bounce Rate", value: `${devices[1].bounceRate}%` },
          { label: "Mobile — Conversões", value: devices[1].conversions.toLocaleString() },
        ],
      },
      {
        type: "highlight",
        content: `⚠️ **Alerta:** O bounce rate no mobile (${devices[1].bounceRate}%) é **${(devices[1].bounceRate - devices[0].bounceRate).toFixed(1)}% maior** que no desktop. A taxa de conversão mobile é significativamente menor. Priorize otimizações de performance e UX mobile.`,
      },
      {
        type: "list",
        content: "Recomendações para mobile",
        items: [
          "Otimize o tempo de carregamento para < 3 segundos",
          "Simplifique o fluxo de checkout para telas menores",
          "Use CTAs maiores e mais visíveis em mobile",
          "Considere AMP para páginas de conteúdo",
        ],
      },
    ],
  };
}

function generateActionResponse(): AIResponse {
  const pages = getTopPages();
  const sources = getTrafficSources();
  const devices = getAudienceByDevice();
  const campaigns = getCampaigns();
  const bestCampaign = [...campaigns].sort((a, b) => b.conversionRate - a.conversionRate)[0];

  return {
    category: "action",
    confidence: 0.88,
    sections: [
      {
        type: "text",
        content: "Com base na análise completa dos seus dados, aqui estão **5 ações práticas** para aumentar conversões:",
      },
      {
        type: "list",
        content: "5 Ações para Aumentar Conversões",
        items: [
          `**1. Aumente o tráfego para /pricing** — Esta página tem a menor bounce rate (${pages[0].bounceRate}%) e maior potencial de conversão. Adicione links internos de todas as páginas de conteúdo.`,
          `**2. Invista mais em ${sources[5].name}** — Com ${sources[5].conversionRate}% de taxa de conversão, é o canal mais eficiente. Aumente o orçamento em 30-50%.`,
          `**3. Otimize a experiência mobile** — ${devices[1].percentage}% do tráfego vem de mobile, mas o bounce rate é ${devices[1].bounceRate}%. Corrija isso para desbloquear +${Math.floor(devices[1].visitors * 0.05)} conversões/mês.`,
          `**4. Replique a estratégia da campanha "${bestCampaign.name}"** — Com ${bestCampaign.conversionRate}% de conversão, é sua campanha mais eficiente. Crie variações com o mesmo targeting.`,
          `**5. Crie mais conteúdo como "${pages[1].title}"** — Posts educacionais têm +${pages[1].change}% de crescimento e bounce rate de apenas ${pages[1].bounceRate}%. Publique 2-3 artigos similares por semana.`,
        ],
      },
      {
        type: "highlight",
        content: "🎯 **Impacto estimado:** Implementando estas 5 ações, você pode esperar um aumento de **15-25% nas conversões** nos próximos 30 dias, baseado nos padrões atuais dos seus dados.",
      },
    ],
  };
}

function generateSummaryResponse(): AIResponse {
  const kpis = getKPIs();
  const sources = getTrafficSources();
  const pages = getTopPages();
  const topGrowth = [...pages].sort((a, b) => b.change - a.change)[0];

  return {
    category: "summary",
    confidence: 0.95,
    sections: [
      {
        type: "text",
        content: "Aqui está o **resumo do seu tráfego dos últimos 30 dias:**",
      },
      {
        type: "metric",
        content: "KPIs Principais",
        metrics: kpis.map((k) => ({
          label: k.label,
          value: k.value,
          change: k.change,
        })),
      },
      {
        type: "text",
        content: "**Destaques do período:**",
      },
      {
        type: "list",
        content: "Highlights",
        items: [
          `📈 **Crescimento sólido** — Visitantes subiram ${kpis[0].change}% e conversões ${kpis[4].change}%, indicando que o tráfego novo é qualificado.`,
          `💰 **Receita crescente** — ${kpis[5].value} gerados (+${kpis[5].change}%), superando o período anterior em $${(48290 - 40717).toLocaleString()}.`,
          `🔍 **SEO forte** — Google Organic lidera com ${sources[0].percentage}% do tráfego (${sources[0].visitors.toLocaleString()} visitantes).`,
          `📄 **Conteúdo em alta** — "${topGrowth.title}" cresceu ${topGrowth.change}% e é a página com maior engajamento (${topGrowth.avgTime} de tempo médio).`,
          `⚡ **Bounce rate melhorando** — Caiu de ${kpis[2].previous} para ${kpis[2].value}, sinal de que os visitantes estão encontrando o que procuram.`,
        ],
      },
      {
        type: "highlight",
        content: "✅ **Veredito geral:** Seu site está em trajetória positiva. Todos os KPIs principais estão em crescimento. Foco recomendado: otimizar mobile e escalar campanhas de email marketing.",
      },
    ],
  };
}

const responseGenerators: Record<QueryCategory, () => AIResponse> = {
  traffic: generateTrafficResponse,
  page: generatePageResponse,
  campaign: generateCampaignResponse,
  conversion: generateConversionResponse,
  audience: generateAudienceResponse,
  action: generateActionResponse,
  summary: generateSummaryResponse,
};

export function processQuery(query: string): AIResponse {
  const category = classifyQuery(query);
  const generator = responseGenerators[category];
  return generator();
}
