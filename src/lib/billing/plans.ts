// ============================================================
// ClarityPulse — Premium Pricing Plans
// Estratégia de monetização inspirada em SaaS globais
// (Plausible, PostHog, Mixpanel, Amplitude, Vercel)
// ============================================================

export type PlanSlug = "starter" | "growth" | "team" | "enterprise";

export type BillingCycle = "monthly" | "yearly";

export type FeatureKey =
    | "dashboard"
  | "realtime"
  | "custom_events"
  | "goals"
  | "funnels"
  | "ai_insights"
  | "ai_chat"
  | "scheduled_reports"
  | "alerts"
  | "api_access"
  | "export_csv"
  | "export_pdf"
  | "export_api"
  | "integrations_basic"
  | "integrations_advanced"
  | "integrations_custom"
  | "sso_saml"
  | "whitelabel"
  | "session_replay"
  | "audit_log"
  | "custom_roles"
  | "dpa"
  | "sla"
  | "onboarding"
  | "dedicated_support"
  | "priority_support"
  | "uptime_guarantee";

// ============================================================
// FEATURE DEFINITIONS
// ============================================================

export interface FeatureDefinition {
    key: FeatureKey;
    label: string;
    description: string;
    category: "analytics" | "ai" | "export" | "integrations" | "team" | "compliance" | "support";
}

export const FEATURES: Record<FeatureKey, FeatureDefinition> = {
    dashboard: { key: "dashboard", label: "Dashboard completo", description: "Visão geral de todas as métricas do seu site", category: "analytics" },
    realtime: { key: "realtime", label: "Realtime", description: "Visualize visitantes em tempo real", category: "analytics" },
    custom_events: { key: "custom_events", label: "Eventos customizados", description: "Rastreie ações específicas dos seus usuários", category: "analytics" },
    goals: { key: "goals", label: "Goals de conversão", description: "Defina e acompanhe metas de conversão", category: "analytics" },
    funnels: { key: "funnels", label: "Funis de conversão", description: "Visualize a jornada do usuário passo a passo", category: "analytics" },
    ai_insights: { key: "ai_insights", label: "IA Insights", description: "Análises automáticas geradas por inteligência artificial", category: "ai" },
    ai_chat: { key: "ai_chat", label: "Pulse AI Chat", description: "Converse com seus dados usando linguagem natural", category: "ai" },
    scheduled_reports: { key: "scheduled_reports", label: "Relatórios automáticos", description: "Receba relatórios por email na frequência desejada", category: "export" },
    alerts: { key: "alerts", label: "Alertas inteligentes", description: "Notificações automáticas sobre anomalias e tendências", category: "ai" },
    api_access: { key: "api_access", label: "API REST", description: "Acesse seus dados programaticamente via API", category: "export" },
    export_csv: { key: "export_csv", label: "Export CSV", description: "Exporte dados em formato CSV", category: "export" },
    export_pdf: { key: "export_pdf", label: "Export PDF", description: "Gere relatórios em PDF para compartilhar", category: "export" },
    export_api: { key: "export_api", label: "Export via API", description: "Exporte dados em massa via API", category: "export" },
    integrations_basic: { key: "integrations_basic", label: "Integrações básicas", description: "Slack e Zapier", category: "integrations" },
    integrations_advanced: { key: "integrations_advanced", label: "Integrações avançadas", description: "Google Ads, Meta Ads, TikTok Ads, Make, n8n", category: "integrations" },
    integrations_custom: { key: "integrations_custom", label: "Integrações customizadas", description: "Webhooks customizados e integrações sob demanda", category: "integrations" },
    sso_saml: { key: "sso_saml", label: "SSO / SAML", description: "Login corporativo com single sign-on", category: "team" },
    whitelabel: { key: "whitelabel", label: "White Label", description: "Domínio customizado e branding próprio", category: "team" },
    session_replay: { key: "session_replay", label: "Session Replay", description: "Assista gravações das sessões dos usuários", category: "analytics" },
    audit_log: { key: "audit_log", label: "Audit Log", description: "Histórico completo de ações da equipe", category: "compliance" },
    custom_roles: { key: "custom_roles", label: "Roles customizados", description: "Permissões granulares para membros da equipe", category: "team" },
    dpa: { key: "dpa", label: "DPA dedicado", description: "Data Processing Agreement personalizado", category: "compliance" },
    sla: { key: "sla", label: "SLA customizado", description: "Acordo de nível de serviço sob medida", category: "compliance" },
    onboarding: { key: "onboarding", label: "Onboarding dedicado", description: "Sessão personalizada de setup com nosso time", category: "support" },
    dedicated_support: { key: "dedicated_support", label: "Suporte dedicado", description: "Canal exclusivo com gerente de conta", category: "support" },
    priority_support: { key: "priority_support", label: "Suporte prioritário", description: "Resposta em até 4h por email", category: "support" },
    uptime_guarantee: { key: "uptime_guarantee", label: "99.99% Uptime SLA", description: "Garantia de disponibilidade com créditos automáticos", category: "compliance" },
};

// ============================================================
// AI LIMITS PER PLAN
// ============================================================

export interface AILimits {
    insightsInterval: string;
    insightsIntervalMs: number;
    chatMessagesPerDay: number; // -1 = unlimited
  chatEnabled: boolean;
}

// ============================================================
// PLAN DEFINITION
// ============================================================

export interface PlanDefinition {
    slug: PlanSlug;
    name: string;
    tagline: string;
    description: string;

  // Pricing (BRL)
  priceMonthly: number; // -1 = custom
  priceYearly: number; // per month when billed yearly
  priceYearlyTotal: number; // total yearly cost

  // Limits
  maxSites: number; // -1 = unlimited
  maxMembers: number; // -1 = unlimited
  maxPageviewsMonth: number; // -1 = unlimited
  maxCustomEvents: number; // max distinct event types, -1 = unlimited
  dataRetentionDays: number; // -1 = unlimited
  dataRetentionLabel: string;

  // AI
  ai: AILimits;

  // Support
  supportLevel: "email" | "priority" | "dedicated";
    supportResponseTime: string;

  // Features
  features: FeatureKey[];

  // Display
  popular: boolean;
    recommended: boolean;
    cta: string;
    ctaVariant: "outline" | "primary" | "gradient";
    badge?: string;
    trialDays: number;
}

// ============================================================
// PLAN DEFINITIONS
// ============================================================

export const PLANS: Record<PlanSlug, PlanDefinition> = {

    // ----------------------------------------------------------
    // STARTER — R$29/mês — Criadores e freelancers
    // ----------------------------------------------------------
    starter: {
          slug: "starter",
          name: "Starter",
          tagline: "Ideal para criadores",
          description: "Para freelancers, blogs e sites em crescimento",
          priceMonthly: 29,
          priceYearly: 24,
          priceYearlyTotal: 288,
          maxSites: 3,
          maxMembers: 2,
          maxPageviewsMonth: 100_000,
          maxCustomEvents: 20,
          dataRetentionDays: 365,
          dataRetentionLabel: "1 ano",
          ai: {
                  insightsInterval: "A cada 12h",
                  insightsIntervalMs: 12 * 60 * 60 * 1000,
                  chatMessagesPerDay: 20,
                  chatEnabled: true,
          },
          supportLevel: "email",
          supportResponseTime: "Até 24h por email",
          features: [
                  "dashboard",
                  "realtime",
                  "custom_events",
                  "goals",
                  "ai_insights",
                  "ai_chat",
                  "scheduled_reports",
                  "export_csv",
                  "export_pdf",
                  "integrations_basic",
                ],
          popular: false,
          recommended: false,
          cta: "Teste grátis 14 dias",
          ctaVariant: "outline",
          trialDays: 14,
    },

    // ----------------------------------------------------------
    // GROWTH — R$79/mês — O mais popular (recomendado)
    // ----------------------------------------------------------
    growth: {
          slug: "growth",
          name: "Growth",
          tagline: "Mais popular",
          description: "Para negócios em crescimento e times de produto",
          priceMonthly: 79,
          priceYearly: 66,
          priceYearlyTotal: 792,
          maxSites: 10,
          maxMembers: 10,
          maxPageviewsMonth: 1_000_000,
          maxCustomEvents: -1,
          dataRetentionDays: 730,
          dataRetentionLabel: "2 anos",
          ai: {
                  insightsInterval: "A cada 4h",
                  insightsIntervalMs: 4 * 60 * 60 * 1000,
                  chatMessagesPerDay: 100,
                  chatEnabled: true,
          },
          supportLevel: "priority",
          supportResponseTime: "Até 4h por email",
          features: [
                  "dashboard",
                  "realtime",
                  "custom_events",
                  "goals",
                  "funnels",
                  "ai_insights",
                  "ai_chat",
                  "alerts",
                  "scheduled_reports",
                  "api_access",
                  "export_csv",
                  "export_pdf",
                  "export_api",
                  "integrations_basic",
                  "integrations_advanced",
                  "priority_support",
                ],
          popular: true,
          recommended: true,
          cta: "Teste grátis 14 dias",
          ctaVariant: "primary",
          badge: "Mais popular",
          trialDays: 14,
    },

    // ----------------------------------------------------------
    // TEAM — R$199/mês — Times e agências
    // ----------------------------------------------------------
    team: {
          slug: "team",
          name: "Team",
          tagline: "Controle total",
          description: "Para empresas e agências que precisam de escala",
          priceMonthly: 199,
          priceYearly: 166,
          priceYearlyTotal: 1_992,
          maxSites: -1,
          maxMembers: -1,
          maxPageviewsMonth: 5_000_000,
          maxCustomEvents: -1,
          dataRetentionDays: 1_825,
          dataRetentionLabel: "5 anos",
          ai: {
                  insightsInterval: "A cada 1h",
                  insightsIntervalMs: 60 * 60 * 1000,
                  chatMessagesPerDay: -1,
                  chatEnabled: true,
          },
          supportLevel: "priority",
          supportResponseTime: "Até 2h por email + chat",
          features: [
                  "dashboard",
                  "realtime",
                  "custom_events",
                  "goals",
                  "funnels",
                  "ai_insights",
                  "ai_chat",
                  "alerts",
                  "scheduled_reports",
                  "api_access",
                  "export_csv",
                  "export_pdf",
                  "export_api",
                  "integrations_basic",
                  "integrations_advanced",
                  "session_replay",
                  "audit_log",
                  "custom_roles",
                  "priority_support",
                ],
          popular: false,
          recommended: false,
          cta: "Teste grátis 14 dias",
          ctaVariant: "outline",
          trialDays: 14,
    },

    // ----------------------------------------------------------
    // ENTERPRISE — Custom — Grandes operações
    // ----------------------------------------------------------
    enterprise: {
          slug: "enterprise",
          name: "Enterprise",
          tagline: "Sob medida",
          description: "Para grandes operações com necessidades específicas",
          priceMonthly: -1,
          priceYearly: -1,
          priceYearlyTotal: -1,
          maxSites: -1,
          maxMembers: -1,
          maxPageviewsMonth: -1,
          maxCustomEvents: -1,
          dataRetentionDays: -1,
          dataRetentionLabel: "Ilimitada",
          ai: {
                  insightsInterval: "Tempo real",
                  insightsIntervalMs: 0,
                  chatMessagesPerDay: -1,
                  chatEnabled: true,
          },
          supportLevel: "dedicated",
          supportResponseTime: "Gerente de conta dedicado 24/7",
          features: [
                  "dashboard",
                  "realtime",
                  "custom_events",
                  "goals",
                  "funnels",
                  "ai_insights",
                  "ai_chat",
                  "alerts",
                  "scheduled_reports",
                  "api_access",
                  "export_csv",
                  "export_pdf",
                  "export_api",
                  "integrations_basic",
                  "integrations_advanced",
                  "integrations_custom",
                  "sso_saml",
                  "whitelabel",
                  "session_replay",
                  "audit_log",
                  "custom_roles",
                  "dpa",
                  "sla",
                  "onboarding",
                  "dedicated_support",
                  "uptime_guarantee",
                ],
          popular: false,
          recommended: false,
          cta: "Falar com vendas",
          ctaVariant: "gradient",
          trialDays: 30,
    },
};

// ============================================================
// PLAN ORDERING & HELPERS
// ============================================================

/** Plans in display order */
export const PLAN_ORDER: PlanSlug[] = ["starter", "growth", "team", "enterprise"];

/** Plans available for self-serve purchase (excludes enterprise) */
export const PURCHASABLE_PLANS: PlanSlug[] = ["starter", "growth", "team"];

/** Plan hierarchy for upgrade/downgrade logic */
export const PLAN_TIER: Record<PlanSlug, number> = {
    starter: 1,
    growth: 2,
    team: 3,
    enterprise: 4,
};

export function getPlan(slug: PlanSlug): PlanDefinition {
    return PLANS[slug];
}

export function isUpgrade(from: PlanSlug, to: PlanSlug): boolean {
    return PLAN_TIER[to] > PLAN_TIER[from];
}

export function isDowngrade(from: PlanSlug, to: PlanSlug): boolean {
    return PLAN_TIER[to] < PLAN_TIER[from];
}

export function hasFeature(planSlug: PlanSlug, feature: FeatureKey): boolean {
    return PLANS[planSlug].features.includes(feature);
}

export function getNextPlan(current: PlanSlug): PlanSlug | null {
    const idx = PLAN_ORDER.indexOf(current);
    if (idx === -1 || idx >= PLAN_ORDER.length - 1) return null;
    return PLAN_ORDER[idx + 1];
}

export function formatPrice(price: number, cycle: BillingCycle = "monthly"): string {
    if (price === -1) return "Sob consulta";
    return `R$${price}`;
}

export function formatLimit(value: number, unit: string): string {
    if (value === -1) return "Ilimitado";
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M ${unit}`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k ${unit}`;
    return `${value} ${unit}`;
}

export function getYearlyDiscount(plan: PlanDefinition): number {
    if (plan.priceMonthly <= 0) return 0;
    return Math.round((1 - plan.priceYearly / plan.priceMonthly) * 100);
}

// ============================================================
// COMPARISON TABLE DATA
// ============================================================

export interface ComparisonRow {
    label: string;
    category: string;
    values: Record<PlanSlug, string | boolean>;
}

export const COMPARISON_TABLE: ComparisonRow[] = [
    // Limites
  { label: "Sites", category: "Limites", values: { starter: "3", growth: "10", team: "Ilimitado", enterprise: "Ilimitado" } },
  { label: "Pageviews/mês", category: "Limites", values: { starter: "100k", growth: "1M", team: "5M", enterprise: "Ilimitado" } },
  { label: "Membros", category: "Limites", values: { starter: "2", growth: "10", team: "Ilimitado", enterprise: "Ilimitado" } },
  { label: "Eventos customizados", category: "Limites", values: { starter: "20 tipos", growth: "Ilimitado", team: "Ilimitado", enterprise: "Ilimitado" } },
  { label: "Retenção de dados", category: "Limites", values: { starter: "1 ano", growth: "2 anos", team: "5 anos", enterprise: "Ilimitada" } },

    // Analytics
  { label: "Dashboard completo", category: "Analytics", values: { starter: true, growth: true, team: true, enterprise: true } },
  { label: "Realtime", category: "Analytics", values: { starter: true, growth: true, team: true, enterprise: true } },
  { label: "Goals de conversão", category: "Analytics", values: { starter: true, growth: true, team: true, enterprise: true } },
  { label: "Funis de conversão", category: "Analytics", values: { starter: false, growth: true, team: true, enterprise: true } },
  { label: "Session Replay", category: "Analytics", values: { starter: false, growth: false, team: true, enterprise: true } },

    // IA
  { label: "IA Insights", category: "Inteligência Artificial", values: { starter: "A cada 12h", growth: "A cada 4h", team: "A cada 1h", enterprise: "Tempo real" } },
  { label: "Pulse AI Chat", category: "Inteligência Artificial", values: { starter: "20 msgs/dia", growth: "100 msgs/dia", team: "Ilimitado", enterprise: "Ilimitado" } },
  { label: "Alertas inteligentes", category: "Inteligência Artificial", values: { starter: false, growth: true, team: true, enterprise: true } },

    // Exportação
  { label: "Export CSV", category: "Exportação", values: { starter: true, growth: true, team: true, enterprise: true } },
  { label: "Export PDF", category: "Exportação", values: { starter: true, growth: true, team: true, enterprise: true } },
  { label: "API REST", category: "Exportação", values: { starter: false, growth: true, team: true, enterprise: true } },
  { label: "Relatórios automáticos", category: "Exportação", values: { starter: "Semanal", growth: "Diário", team: "Custom", enterprise: "Custom" } },

    // Integrações
  { label: "Slack + Zapier", category: "Integrações", values: { starter: true, growth: true, team: true, enterprise: true } },
  { label: "Google/Meta/TikTok Ads", category: "Integrações", values: { starter: false, growth: true, team: true, enterprise: true } },
  { label: "Webhooks customizados", category: "Integrações", values: { starter: false, growth: false, team: false, enterprise: true } },

    // Time
  { label: "Roles (Admin/Editor/Viewer)", category: "Time", values: { starter: false, growth: true, team: true, enterprise: true } },
  { label: "Roles customizados", category: "Time", values: { starter: false, growth: false, team: true, enterprise: true } },
  { label: "SSO / SAML", category: "Time", values: { starter: false, growth: false, team: false, enterprise: true } },
  { label: "Audit Log", category: "Time", values: { starter: false, growth: false, team: true, enterprise: true } },
  { label: "White Label", category: "Time", values: { starter: false, growth: false, team: false, enterprise: true } },

    // Suporte
  { label: "Suporte", category: "Suporte", values: { starter: "Email (24h)", growth: "Email (4h)", team: "Email + Chat (2h)", enterprise: "Dedicado 24/7" } },
  { label: "Onboarding dedicado", category: "Suporte", values: { starter: false, growth: false, team: false, enterprise: true } },
  { label: "DPA dedicado", category: "Suporte", values: { starter: false, growth: false, team: false, enterprise: true } },
  { label: "SLA customizado", category: "Suporte", values: { starter: false, growth: false, team: false, enterprise: true } },
  ];
