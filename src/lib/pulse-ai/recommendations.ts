/**
 * Pulse AI — Actionable Recommendations Engine
 *
 * Generates prioritized, actionable recommendations
 * based on analytics data analysis.
 */

import { getKPIs, getTrafficSources, getTopPages, getCampaigns, getAudienceByDevice } from "./analytics-data";

export type RecommendationCategory = "conversion" | "traffic" | "content" | "technical" | "campaign" | "ux";
export type RecommendationEffort = "low" | "medium" | "high";
export type RecommendationImpact = "high" | "medium" | "low";

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  reasoning: string;
  steps: string[];
  estimatedImpact: string;
  effort: RecommendationEffort;
  impact: RecommendationImpact;
  timeToImplement: string;
  priority: number; // 1 = highest
  metrics: {
    label: string;
    current: string;
    projected: string;
  }[];
  status: "new" | "in_progress" | "completed" | "dismissed";
}

export function generateRecommendations(): Recommendation[] {
  const kpis = getKPIs();
  const sources = getTrafficSources();
  const pages = getTopPages();
  const campaigns = getCampaigns();
  const devices = getAudienceByDevice();

  return [
    {
      id: "rec-1",
      category: "conversion",
      title: "Otimize o fluxo de signup para conversão",
      description: "A página /signup tem 35% de bounce rate e a taxa de conversão está em 6.5% vs meta de 10%. Simplificando o formulário, é possível ganhar +150 signups/mês.",
      reasoning: "Análise do funil mostra que 35% dos visitantes abandonam na página de signup. Formulários longos são a principal causa de abandono em SaaS.",
      steps: [
        "Reduza o formulário para apenas email + senha (2 campos)",
        "Adicione login social (Google, GitHub)",
        "Implemente barra de progresso no signup",
        "Colete dados adicionais no onboarding pós-cadastro",
        "Adicione depoimentos e garantias ao lado do formulário",
      ],
      estimatedImpact: "+150 signups/mês (+35% de conversão na página)",
      effort: "medium",
      impact: "high",
      timeToImplement: "1-2 semanas",
      priority: 1,
      metrics: [
        { label: "Conversão /signup", current: "6.5%", projected: "10%" },
        { label: "Novos signups/mês", current: "280", projected: "430" },
        { label: "Bounce rate /signup", current: "35%", projected: "20%" },
      ],
      status: "new",
    },
    {
      id: "rec-2",
      category: "technical",
      title: "Reduza o tempo de carregamento mobile para < 3s",
      description: `O mobile representa ${devices[1].percentage}% do tráfego mas tem bounce rate de ${devices[1].bounceRate}%. O tempo de carregamento médio é de 4.8s.`,
      reasoning: `Com ${devices[1].visitors.toLocaleString()} visitantes mobile/mês e bounce rate de ${devices[1].bounceRate}%, cada segundo de redução no carregamento pode recuperar ~7% das conversões.`,
      steps: [
        "Comprima todas as imagens (WebP, AVIF) — salve ~60% do peso",
        "Implemente lazy loading para imagens e componentes below-the-fold",
        "Ative cache de assets estáticos (CDN) com TTL de 30 dias",
        "Reduza JavaScript bundle com code splitting por rota",
        "Remova scripts de terceiros desnecessários",
      ],
      estimatedImpact: "+85 conversões/mês (-15% bounce rate mobile)",
      effort: "medium",
      impact: "high",
      timeToImplement: "1-2 semanas",
      priority: 2,
      metrics: [
        { label: "Bounce Rate Mobile", current: `${devices[1].bounceRate}%`, projected: "38%" },
        { label: "Load Time Mobile", current: "4.8s", projected: "2.5s" },
        { label: "Conversões Mobile", current: `${devices[1].conversions}`, projected: `${devices[1].conversions + 85}` },
      ],
      status: "new",
    },
    {
      id: "rec-3",
      category: "traffic",
      title: "Escale o Email Marketing — seu canal mais eficiente",
      description: `Email Marketing tem ${sources[3].conversionRate}% de conversão, o dobro da média do site, mas representa apenas ${sources[3].percentage}% do tráfego.`,
      reasoning: "O email traz visitantes com alta intenção de compra que já conhecem a marca. É o canal com melhor ROI e pode ser escalado sem custo significativo.",
      steps: [
        "Aumente a frequência de newsletters de 1x para 2x por semana",
        "Crie sequência automatizada de nurturing (7 emails)",
        "Segmente a lista por comportamento (visitou pricing, leu blog, etc.)",
        "Teste subject lines com A/B testing",
        "Adicione email capture em todas as páginas do blog",
      ],
      estimatedImpact: "+120 conversões/mês (2x tráfego email)",
      effort: "low",
      impact: "high",
      timeToImplement: "3-5 dias",
      priority: 3,
      metrics: [
        { label: "Visitantes via Email", current: sources[3].visitors.toLocaleString(), projected: (sources[3].visitors * 2).toLocaleString() },
        { label: "Conversões via Email", current: sources[3].conversions.toString(), projected: (sources[3].conversions * 2).toString() },
        { label: "% do Tráfego", current: `${sources[3].percentage}%`, projected: `${sources[3].percentage * 2}%` },
      ],
      status: "new",
    },
    {
      id: "rec-4",
      category: "content",
      title: "Publique 3 artigos/semana sobre analytics e privacidade",
      description: `Conteúdo educacional está gerando +${pages[1].change}% de crescimento orgânico. "${pages[1].title}" é sua página com mais engajamento (${pages[1].avgTime}).`,
      reasoning: "Blog posts sobre privacy analytics estão rankeanado nas top 3 posições do Google. Este é um cluster de conteúdo com alta demanda e baixa concorrência.",
      steps: [
        `Crie variações de "${pages[1].title}" para long-tail keywords`,
        "Desenvolva guias comparativos (ClarityPulse vs GA4, vs Plausible)",
        "Produza conteúdo em vídeo para complementar posts escritos",
        "Adicione CTAs internos em todos os posts linkando para /pricing",
        "Crie lead magnets (ebooks, templates) para capturar emails",
      ],
      estimatedImpact: "+3.000 visitantes orgânicos/mês em 60 dias",
      effort: "medium",
      impact: "high",
      timeToImplement: "Contínuo (3-5 posts/semana)",
      priority: 4,
      metrics: [
        { label: "Tráfego Orgânico", current: sources[0].visitors.toLocaleString(), projected: (sources[0].visitors + 3000).toLocaleString() },
        { label: "Posts Publicados/mês", current: "4", projected: "12" },
        { label: "Keywords na 1ª página", current: "8", projected: "20+" },
      ],
      status: "new",
    },
    {
      id: "rec-5",
      category: "campaign",
      title: "Pause campanhas com ROI negativo e realoque budget",
      description: `A campanha "${campaigns[3].name}" via ${campaigns[3].source} tem queda de ${Math.abs(campaigns[3].change)}% e ROI negativo. Redistribua para "${campaigns[4].name}" (+${campaigns[4].change}%).`,
      reasoning: "Manter campanhas com ROI negativo é desperdiçar orçamento. O budget pode ter retorno 3x maior em canais eficientes.",
      steps: [
        `Pause a campanha "${campaigns[3].name}" imediatamente`,
        `Realoque 60% do budget para "${campaigns[4].name}" (${campaigns[4].conversionRate}% conv.)`,
        "Aloque 30% para testes A/B em novos criativos",
        "Reserve 10% para experimentação em novos canais",
        "Configure alertas automáticos para ROI < 0",
      ],
      estimatedImpact: "+$2.400/mês em receita recuperada",
      effort: "low",
      impact: "medium",
      timeToImplement: "1-2 dias",
      priority: 5,
      metrics: [
        { label: "ROI Campanha Pausada", current: "-18.9%", projected: "N/A (pausada)" },
        { label: `ROI "${campaigns[4].name}"`, current: `+${campaigns[4].change}%`, projected: `+${Math.round(campaigns[4].change * 1.3)}%` },
        { label: "Receita Recuperada", current: "$0", projected: "$2,400/mês" },
      ],
      status: "new",
    },
    {
      id: "rec-6",
      category: "ux",
      title: "Adicione CTAs internos nas páginas de blog para /pricing",
      description: "Posts de blog têm alto engajamento mas baixa conversão direta. Links internos para /pricing podem capturar visitantes com intenção.",
      reasoning: "A página /pricing tem a maior taxa de conversão do site. Direcionar tráfego qualificado do blog para ela pode multiplicar conversões.",
      steps: [
        "Adicione banner CTA no meio e fim de cada post",
        "Crie widget sidebar com comparativo de planos",
        "Use exit-intent popup oferecendo trial gratuito",
        "Adicione 'related features' ao final de posts relevantes",
        "Implemente hello bar com oferta especial no topo do blog",
      ],
      estimatedImpact: "+60 conversões/mês (3% dos leitores de blog)",
      effort: "low",
      impact: "medium",
      timeToImplement: "2-3 dias",
      priority: 6,
      metrics: [
        { label: "Blog → Pricing (CTR)", current: "2.1%", projected: "5%" },
        { label: "Conversões via Blog", current: "45", projected: "105" },
        { label: "Receita Incremental", current: "$0", projected: "$1,800/mês" },
      ],
      status: "new",
    },
  ];
}
