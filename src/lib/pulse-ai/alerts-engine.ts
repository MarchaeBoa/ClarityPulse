/**
 * Pulse AI — Smart Alerts Engine
 *
 * Generates intelligent alerts in natural language.
 * Detects anomalies, threshold breaches, and trend shifts.
 */

import { getKPIs, getTrafficSources, getTopPages, getCampaigns } from "./analytics-data";

export type AlertPriority = "urgent" | "important" | "info";
export type AlertChannel = "dashboard" | "email" | "whatsapp" | "slack";
export type AlertStatus = "new" | "seen" | "dismissed" | "acted";

export interface SmartAlert {
  id: string;
  priority: AlertPriority;
  title: string;
  message: string;
  explanation: string;
  channels: AlertChannel[];
  status: AlertStatus;
  createdAt: string;
  category: "conversion" | "traffic" | "campaign" | "page" | "revenue" | "engagement";
  metric: string;
  currentValue: string;
  previousValue: string;
  changePercent: number;
  suggestedAction: string;
}

function timeAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export function generateSmartAlerts(): SmartAlert[] {
  const kpis = getKPIs();
  const sources = getTrafficSources();
  const pages = getTopPages();
  const campaigns = getCampaigns();

  const alerts: SmartAlert[] = [
    {
      id: "alert-conv-drop",
      priority: "urgent",
      title: "Sua conversão caiu 18% esta semana",
      message: "A taxa de conversão caiu de 8.2% para 6.7% nos últimos 7 dias, afetando principalmente o tráfego vindo de Social Media.",
      explanation: "Analisamos o funil de conversão e detectamos que a queda está concentrada nas páginas de produto acessadas via Instagram e TikTok. O tempo de carregamento dessas páginas no mobile aumentou 2.3 segundos esta semana.",
      channels: ["dashboard", "email", "whatsapp"],
      status: "new",
      createdAt: timeAgo(1),
      category: "conversion",
      metric: "Taxa de Conversão",
      currentValue: "6.7%",
      previousValue: "8.2%",
      changePercent: -18.3,
      suggestedAction: "Otimize o tempo de carregamento das landing pages mobile. Priorize compressão de imagens e lazy loading.",
    },
    {
      id: "alert-traffic-spike",
      priority: "important",
      title: "Tráfego orgânico subiu 34% — novo recorde!",
      message: "O Google Organic trouxe 2.340 visitantes extras esta semana graças ao artigo 'Privacy Analytics Guide' que está rankeando na primeira página.",
      explanation: "O artigo atingiu a posição #3 para 'analytics privacy-first'. Esse tipo de conteúdo educacional tem taxa de conversão 2x maior que a média do site.",
      channels: ["dashboard", "email"],
      status: "new",
      createdAt: timeAgo(3),
      category: "traffic",
      metric: "Tráfego Orgânico",
      currentValue: "12,148",
      previousValue: "9,808",
      changePercent: 23.8,
      suggestedAction: "Crie mais conteúdo similar sobre privacidade e analytics. Considere criar um cluster de conteúdo sobre o tema.",
    },
    {
      id: "alert-bounce-mobile",
      priority: "urgent",
      title: "Bounce rate no mobile atingiu 52%",
      message: "O bounce rate em dispositivos móveis subiu 5 pontos percentuais esta semana, atingindo 52%. Isso está custando aproximadamente 400 conversões por mês.",
      explanation: "As páginas /pricing e /features estão com tempo de carregamento de 5.8s no mobile (vs 2.1s no desktop). O Core Web Vitals LCP está em 'vermelho' para 67% das sessões mobile.",
      channels: ["dashboard", "email", "whatsapp"],
      status: "new",
      createdAt: timeAgo(5),
      category: "engagement",
      metric: "Bounce Rate Mobile",
      currentValue: "52%",
      previousValue: "47%",
      changePercent: 10.6,
      suggestedAction: "Reduza o tamanho das imagens em /pricing e /features. Implemente lazy loading e considere AMP para páginas de conteúdo.",
    },
    {
      id: "alert-campaign-roi",
      priority: "important",
      title: "Campanha 'Launch 2024' com ROI negativo",
      message: "A campanha Launch 2024 via Twitter/Social gastou estimado de $3.500 mas gerou apenas $2.840 em receita, resultando em ROI de -18.9%.",
      explanation: "O público alcançado via Twitter tem menor intenção de compra comparado a outros canais. A taxa de conversão é de apenas 5% vs 10% do Paid Search.",
      channels: ["dashboard", "email"],
      status: "seen",
      createdAt: timeAgo(12),
      category: "campaign",
      metric: "ROI da Campanha",
      currentValue: "-18.9%",
      previousValue: "5.2%",
      changePercent: -463,
      suggestedAction: "Pause a campanha Launch 2024 e redistribua o orçamento para 'Promo March' (email) que tem 12% de conversão.",
    },
    {
      id: "alert-revenue-up",
      priority: "info",
      title: "Receita semanal superou a meta em 12%",
      message: "A receita desta semana foi de $12.480, superando a meta de $11.150 em 12%. O ticket médio subiu de $26 para $31.",
      explanation: "O aumento no ticket médio está correlacionado com o lançamento do plano Growth que está convertendo 23% dos trials. Upsell do Starter para Growth representa 35% da receita nova.",
      channels: ["dashboard"],
      status: "seen",
      createdAt: timeAgo(18),
      category: "revenue",
      metric: "Receita Semanal",
      currentValue: "$12,480",
      previousValue: "$11,150",
      changePercent: 11.9,
      suggestedAction: "Mantenha a estratégia de upsell atual. Considere criar um fluxo automatizado de upgrade para usuários em trial.",
    },
    {
      id: "alert-page-drop",
      priority: "important",
      title: "Página 'About Us' perdeu 8.2% de tráfego",
      message: "A página /about teve queda de 8.2% nas visualizações e o bounce rate subiu para 48.3%. Essa é a única página principal com queda.",
      explanation: "A página não é atualizada há 45 dias. Páginas estáticas tendem a perder relevância no Google após períodos sem atualização. O conteúdo pode estar desatualizado.",
      channels: ["dashboard"],
      status: "dismissed",
      createdAt: timeAgo(24),
      category: "page",
      metric: "Pageviews",
      currentValue: "3,100",
      previousValue: "3,377",
      changePercent: -8.2,
      suggestedAction: "Atualize o conteúdo da página /about com informações recentes, depoimentos e números atualizados.",
    },
    {
      id: "alert-email-perf",
      priority: "info",
      title: "Email Marketing é seu canal mais eficiente",
      message: "Com apenas 10% do tráfego, Email Marketing gera 12% das conversões. A taxa de conversão de 9% é 2x maior que a média do site.",
      explanation: "Leads que chegam via email já conhecem sua marca e têm maior intenção de compra. O segmento de 'clientes antigos' tem 15% de conversão.",
      channels: ["dashboard"],
      status: "new",
      createdAt: timeAgo(36),
      category: "traffic",
      metric: "Eficiência do Canal",
      currentValue: "9%",
      previousValue: "7.5%",
      changePercent: 20,
      suggestedAction: "Aumente a frequência de emails para segmentos engajados. Considere uma série de nurturing para leads frios.",
    },
  ];

  return alerts;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: "drops_below" | "rises_above" | "changes_by";
  threshold: number;
  channels: AlertChannel[];
  enabled: boolean;
}

export function getDefaultAlertRules(): AlertRule[] {
  return [
    {
      id: "rule-1",
      name: "Queda de conversão",
      description: "Alerta quando a taxa de conversão cair mais que o limite",
      metric: "conversion_rate",
      condition: "drops_below",
      threshold: 5,
      channels: ["dashboard", "email", "whatsapp"],
      enabled: true,
    },
    {
      id: "rule-2",
      name: "Pico de tráfego",
      description: "Alerta quando o tráfego subir acima do limite",
      metric: "visitors",
      condition: "rises_above",
      threshold: 30000,
      channels: ["dashboard", "email"],
      enabled: true,
    },
    {
      id: "rule-3",
      name: "Bounce rate alto",
      description: "Alerta quando o bounce rate ultrapassar o limite",
      metric: "bounce_rate",
      condition: "rises_above",
      threshold: 50,
      channels: ["dashboard", "whatsapp"],
      enabled: true,
    },
    {
      id: "rule-4",
      name: "Variação de receita",
      description: "Alerta quando a receita variar mais que o limite",
      metric: "revenue",
      condition: "changes_by",
      threshold: 15,
      channels: ["dashboard", "email", "slack"],
      enabled: false,
    },
    {
      id: "rule-5",
      name: "Campanha com baixo ROI",
      description: "Alerta quando uma campanha tiver ROI negativo",
      metric: "campaign_roi",
      condition: "drops_below",
      threshold: 0,
      channels: ["dashboard", "email"],
      enabled: true,
    },
  ];
}
