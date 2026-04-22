// ============================================================
// ClarityPulse — Paywall Messages & Upgrade Incentives
// Mensagens elegantes e não-intrusivas para converter usuários
// ============================================================

import type { PlanSlug, FeatureKey } from "./plans";
import { PLANS, FEATURES, getNextPlan, formatPrice } from "./plans";

// ============================================================
// PAYWALL MESSAGE TYPES
// ============================================================

export interface PaywallMessage {
  title: string;
  description: string;
  cta: string;
  ctaSecondary?: string;
  emoji?: string;
  targetPlan: PlanSlug;
  tone: "soft" | "urgent" | "value";
}

// ============================================================
// FEATURE PAYWALL MESSAGES
// ============================================================

const FEATURE_PAYWALLS: Partial<Record<FeatureKey, (targetPlan: PlanSlug) => PaywallMessage>> = {
  ai_insights: (targetPlan) => ({
    title: "Desbloqueie insights automáticos com IA",
    description: "Deixe a inteligência artificial analisar seus dados e descobrir tendências, anomalias e oportunidades que você não veria sozinho.",
    cta: `Ativar IA — ${planCtaPrice(targetPlan)}`,
    ctaSecondary: "Ver o que a IA encontra",
    targetPlan,
    tone: "value",
  }),

  ai_chat: (targetPlan) => ({
    title: "Converse com seus dados",
    description: "Pergunte qualquer coisa sobre seu tráfego em linguagem natural. O Pulse AI responde com dados reais, não suposições.",
    cta: `Ativar Pulse AI — ${planCtaPrice(targetPlan)}`,
    ctaSecondary: "Ver demonstração",
    targetPlan,
    tone: "value",
  }),

  funnels: (targetPlan) => ({
    title: "Visualize a jornada completa do usuário",
    description: "Funis de conversão mostram exatamente onde seus visitantes abandonam e onde você pode otimizar para converter mais.",
    cta: `Desbloquear funis — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),

  goals: (targetPlan) => ({
    title: "Defina e acompanhe suas conversões",
    description: "Crie metas de conversão e veja em tempo real quantos visitantes estão completando as ações que importam para seu negócio.",
    cta: `Ativar goals — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),

  api_access: (targetPlan) => ({
    title: "Acesse seus dados via API",
    description: "Integre seus dados do ClarityPulse com qualquer ferramenta. Nossa API REST fornece acesso programático completo às suas métricas.",
    cta: `Ativar API — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),

  alerts: (targetPlan) => ({
    title: "Nunca perca uma anomalia",
    description: "Alertas inteligentes monitoram seu tráfego 24/7 e avisam quando algo incomum acontece — quedas, picos, ou mudanças de padrão.",
    cta: `Ativar alertas — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),

  session_replay: (targetPlan) => ({
    title: "Veja o que seus usuários realmente fazem",
    description: "Session Replay grava as sessões dos visitantes para que você entenda exatamente como eles navegam — cliques, scrolls e tudo mais.",
    cta: `Ativar Session Replay — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),

  sso_saml: (targetPlan) => ({
    title: "Login corporativo para sua equipe",
    description: "Simplifique o acesso com SSO/SAML. Seus colaboradores fazem login com as credenciais corporativas, sem senhas separadas.",
    cta: "Falar com vendas",
    targetPlan,
    tone: "value",
  }),

  integrations_advanced: (targetPlan) => ({
    title: "Conecte seus canais de aquisição",
    description: "Importe dados de custo do Google Ads, Meta Ads e TikTok Ads para calcular ROI real de cada campanha diretamente no ClarityPulse.",
    cta: `Ativar integrações — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),

  scheduled_reports: (targetPlan) => ({
    title: "Relatórios que chegam até você",
    description: "Receba automaticamente relatórios por email com as métricas que importam — na frequência que você escolher.",
    cta: `Ativar relatórios — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  }),
};

export function getFeaturePaywall(feature: FeatureKey, currentPlan: PlanSlug): PaywallMessage | null {
  // Find the minimum plan that has this feature
  const plans: PlanSlug[] = ["starter", "growth", "team", "enterprise"];
  let targetPlan: PlanSlug | null = null;

  for (const slug of plans) {
    if (PLANS[slug].features.includes(feature)) {
      targetPlan = slug;
      break;
    }
  }

  if (!targetPlan) return null;

  const builder = FEATURE_PAYWALLS[feature];
  if (builder) return builder(targetPlan);

  // Generic fallback
  const featureDef = FEATURES[feature];
  return {
    title: `Desbloqueie: ${featureDef.label}`,
    description: featureDef.description,
    cta: `Fazer upgrade — ${planCtaPrice(targetPlan)}`,
    targetPlan,
    tone: "value",
  };
}

// ============================================================
// LIMIT PAYWALL MESSAGES
// ============================================================

export function getPageviewLimitPaywall(current: number, limit: number, planSlug: PlanSlug): PaywallMessage {
  const nextPlan = getNextPlan(planSlug);
  const percentage = Math.round((current / limit) * 100);

  if (percentage >= 100) {
    return {
      title: "Você atingiu o limite de pageviews",
      description: `Seu site registrou ${formatNumber(current)} pageviews este mês, ultrapassando o limite de ${formatNumber(limit)} do plano ${PLANS[planSlug].name}. Novos dados podem não ser registrados.`,
      cta: nextPlan ? `Upgrade para ${PLANS[nextPlan].name} — ${planCtaPrice(nextPlan)}` : "Falar com vendas",
      ctaSecondary: "Ver uso detalhado",
      targetPlan: nextPlan ?? "enterprise",
      tone: "urgent",
    };
  }

  return {
    title: "Você está chegando perto do limite",
    description: `${percentage}% do limite de pageviews usado (${formatNumber(current)}/${formatNumber(limit)}). Considere fazer upgrade para não perder dados.`,
    cta: nextPlan ? `Ver plano ${PLANS[nextPlan].name}` : "Falar com vendas",
    targetPlan: nextPlan ?? "enterprise",
    tone: "soft",
  };
}

export function getSiteLimitPaywall(planSlug: PlanSlug): PaywallMessage {
  const nextPlan = getNextPlan(planSlug);
  const plan = PLANS[planSlug];

  return {
    title: "Adicione mais sites ao ClarityPulse",
    description: `Seu plano ${plan.name} permite até ${plan.maxSites} site${plan.maxSites > 1 ? "s" : ""}. Faça upgrade para monitorar todos os seus projetos em um só lugar.`,
    cta: nextPlan ? `Upgrade para ${PLANS[nextPlan].name} — ${planCtaPrice(nextPlan)}` : "Falar com vendas",
    targetPlan: nextPlan ?? "enterprise",
    tone: "soft",
  };
}

export function getMemberLimitPaywall(planSlug: PlanSlug): PaywallMessage {
  const nextPlan = getNextPlan(planSlug);
  const plan = PLANS[planSlug];

  return {
    title: "Convide mais membros para o time",
    description: `Seu plano ${plan.name} permite até ${plan.maxMembers} membro${plan.maxMembers > 1 ? "s" : ""}. Faça upgrade para colaborar com toda a equipe.`,
    cta: nextPlan ? `Upgrade para ${PLANS[nextPlan].name} — ${planCtaPrice(nextPlan)}` : "Falar com vendas",
    targetPlan: nextPlan ?? "enterprise",
    tone: "soft",
  };
}

export function getAIChatLimitPaywall(planSlug: PlanSlug): PaywallMessage {
  const nextPlan = getNextPlan(planSlug);
  const plan = PLANS[planSlug];

  return {
    title: "Limite de mensagens atingido",
    description: `Você usou todas as ${plan.ai.chatMessagesPerDay} mensagens do Pulse AI hoje. Faça upgrade para conversar mais com seus dados.`,
    cta: nextPlan ? `Upgrade para ${PLANS[nextPlan].name}` : "Falar com vendas",
    ctaSecondary: "Volta amanhã às 00h",
    targetPlan: nextPlan ?? "enterprise",
    tone: "soft",
  };
}

// ============================================================
// UPGRADE INCENTIVE MESSAGES (banners, tooltips, nudges)
// ============================================================

export interface UpgradeIncentive {
  trigger: string;
  message: string;
  cta: string;
  targetPlan: PlanSlug;
}

export function getUpgradeIncentives(currentPlan: PlanSlug): UpgradeIncentive[] {
  const nextPlan = getNextPlan(currentPlan);
  if (!nextPlan) return [];

  const next = PLANS[nextPlan];
  const incentives: UpgradeIncentive[] = [];

  if (currentPlan === "starter") {
    incentives.push(
      {
        trigger: "try_funnel",
        message: "Funis de conversão estão disponíveis no plano Growth. Veja onde seus visitantes abandonam.",
        cta: `Upgrade para Growth — ${formatPrice(PLANS.growth.priceMonthly)}/mês`,
        targetPlan: "growth",
      },
      {
        trigger: "try_api",
        message: "Precisa de API? O plano Growth inclui acesso completo à API REST.",
        cta: `Upgrade para Growth`,
        targetPlan: "growth",
      },
    );
  }

  if (currentPlan === "growth") {
    incentives.push(
      {
        trigger: "member_limit_near",
        message: "Seu time está crescendo! O plano Team oferece membros ilimitados e Session Replay.",
        cta: `Upgrade para Team — ${formatPrice(PLANS.team.priceMonthly)}/mês`,
        targetPlan: "team",
      },
    );
  }

  return incentives;
}

// ============================================================
// TRIAL MESSAGES
// ============================================================

export function getTrialMessage(daysRemaining: number, planSlug: PlanSlug): PaywallMessage | null {
  if (daysRemaining > 7) return null;

  const plan = PLANS[planSlug];

  if (daysRemaining <= 0) {
    return {
      title: "Seu período de teste acabou",
      description: `Seu trial do plano ${plan.name} expirou. Assine agora para continuar com todos os recursos desbloqueados.`,
      cta: `Assinar ${plan.name} — ${formatPrice(plan.priceMonthly)}/mês`,
      ctaSecondary: "Ver outros planos",
      targetPlan: planSlug,
      tone: "urgent",
    };
  }

  if (daysRemaining <= 3) {
    return {
      title: `Faltam ${daysRemaining} dia${daysRemaining > 1 ? "s" : ""} no seu trial`,
      description: `Seu acesso ao plano ${plan.name} termina em breve. Assine para não perder o acesso a IA Insights, relatórios automáticos e mais.`,
      cta: `Assinar agora — ${formatPrice(plan.priceMonthly)}/mês`,
      ctaSecondary: "Lembrar depois",
      targetPlan: planSlug,
      tone: "urgent",
    };
  }

  return {
    title: `${daysRemaining} dias restantes no trial`,
    description: `Você está aproveitando o plano ${plan.name}. Assine quando quiser para garantir acesso contínuo.`,
    cta: `Assinar ${plan.name}`,
    targetPlan: planSlug,
    tone: "soft",
  };
}

// ============================================================
// HELPERS
// ============================================================

function planCtaPrice(slug: PlanSlug): string {
  const plan = PLANS[slug];
  if (plan.priceMonthly <= 0) return "consulte";
  return `R$${plan.priceMonthly}/mês`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toLocaleString("pt-BR");
}
