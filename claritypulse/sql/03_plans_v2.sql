-- ============================================================
-- ClarityPulse — Atualização de Planos Premium v2
-- Migração: Free → Starter → Growth → Team → Enterprise
-- ============================================================

-- Desativar planos antigos
UPDATE public.plans SET is_active = false WHERE slug IN ('starter', 'pro', 'agency');

-- ============================================================
-- NOVOS PLANOS
-- ============================================================

-- Atualizar Free (manter, ajustar limites)
UPDATE public.plans
SET
  max_sites = 1,
  max_pageviews_month = 10000,
  max_members = 1,
  data_retention_days = 90,
  has_ai_insights = false,
  has_session_replay = false,
  has_whitelabel = false,
  has_api_access = false,
  has_scheduled_reports = false,
  has_custom_events = true,
  features = '[
    "dashboard",
    "realtime",
    "custom_events",
    "export_csv"
  ]'::jsonb,
  price_brl_monthly = NULL,
  price_brl_yearly = NULL,
  sort_order = 1
WHERE slug = 'free';

-- Inserir novos planos (ou atualizar se existir)
INSERT INTO public.plans (
  name, slug, max_sites, max_pageviews_month, max_members,
  data_retention_days, has_ai_insights, has_session_replay, has_whitelabel,
  has_api_access, has_scheduled_reports, has_custom_events,
  features, price_brl_monthly, price_brl_yearly,
  sort_order, is_active
) VALUES

-- STARTER — R$29/mês (R$24/mês anual = R$288/ano)
(
  'Starter', 'starter_v2', 3, 100000, 2,
  365, true, false, false,
  false, true, true,
  '[
    "dashboard", "realtime", "custom_events", "goals",
    "ai_insights", "ai_chat", "scheduled_reports",
    "export_csv", "export_pdf", "integrations_basic"
  ]'::jsonb,
  2900, 28800,
  2, true
),

-- GROWTH — R$79/mês (R$66/mês anual = R$792/ano)
(
  'Growth', 'growth', 10, 1000000, 10,
  730, true, false, false,
  true, true, true,
  '[
    "dashboard", "realtime", "custom_events", "goals", "funnels",
    "ai_insights", "ai_chat", "alerts", "scheduled_reports",
    "api_access", "export_csv", "export_pdf", "export_api",
    "integrations_basic", "integrations_advanced", "priority_support"
  ]'::jsonb,
  7900, 79200,
  3, true
),

-- TEAM — R$199/mês (R$166/mês anual = R$1.992/ano)
(
  'Team', 'team', -1, 5000000, -1,
  1825, true, true, false,
  true, true, true,
  '[
    "dashboard", "realtime", "custom_events", "goals", "funnels",
    "ai_insights", "ai_chat", "alerts", "scheduled_reports",
    "api_access", "export_csv", "export_pdf", "export_api",
    "integrations_basic", "integrations_advanced",
    "session_replay", "audit_log", "custom_roles", "priority_support"
  ]'::jsonb,
  19900, 199200,
  4, true
)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  max_sites = EXCLUDED.max_sites,
  max_pageviews_month = EXCLUDED.max_pageviews_month,
  max_members = EXCLUDED.max_members,
  data_retention_days = EXCLUDED.data_retention_days,
  has_ai_insights = EXCLUDED.has_ai_insights,
  has_session_replay = EXCLUDED.has_session_replay,
  has_whitelabel = EXCLUDED.has_whitelabel,
  has_api_access = EXCLUDED.has_api_access,
  has_scheduled_reports = EXCLUDED.has_scheduled_reports,
  has_custom_events = EXCLUDED.has_custom_events,
  features = EXCLUDED.features,
  price_brl_monthly = EXCLUDED.price_brl_monthly,
  price_brl_yearly = EXCLUDED.price_brl_yearly,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- Atualizar Enterprise (manter slug, ajustar features)
UPDATE public.plans
SET
  max_sites = -1,
  max_pageviews_month = -1,
  max_members = -1,
  data_retention_days = -1,
  has_ai_insights = true,
  has_session_replay = true,
  has_whitelabel = true,
  has_api_access = true,
  has_scheduled_reports = true,
  has_custom_events = true,
  features = '[
    "dashboard", "realtime", "custom_events", "goals", "funnels",
    "ai_insights", "ai_chat", "alerts", "scheduled_reports",
    "api_access", "export_csv", "export_pdf", "export_api",
    "integrations_basic", "integrations_advanced", "integrations_custom",
    "sso_saml", "whitelabel", "session_replay",
    "audit_log", "custom_roles", "dpa", "sla",
    "onboarding", "dedicated_support", "uptime_guarantee"
  ]'::jsonb,
  price_brl_monthly = NULL,
  price_brl_yearly = NULL,
  sort_order = 5,
  is_active = true
WHERE slug = 'enterprise';

-- ============================================================
-- TABELA DE LIMITES DE IA POR PLANO
-- ============================================================

CREATE TABLE IF NOT EXISTS public.plan_ai_limits (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id               uuid NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  insights_interval_sec integer NOT NULL DEFAULT -1,
  -- -1 = desabilitado, 0 = tempo real
  chat_messages_per_day integer NOT NULL DEFAULT 0,
  -- -1 = ilimitado
  chat_enabled          boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id)
);

-- Inserir limites de IA
INSERT INTO public.plan_ai_limits (plan_id, insights_interval_sec, chat_messages_per_day, chat_enabled)
SELECT id, -1, 0, false FROM public.plans WHERE slug = 'free'
ON CONFLICT (plan_id) DO UPDATE SET insights_interval_sec = -1, chat_messages_per_day = 0, chat_enabled = false;

INSERT INTO public.plan_ai_limits (plan_id, insights_interval_sec, chat_messages_per_day, chat_enabled)
SELECT id, 43200, 20, true FROM public.plans WHERE slug = 'starter_v2'
ON CONFLICT (plan_id) DO UPDATE SET insights_interval_sec = 43200, chat_messages_per_day = 20, chat_enabled = true;

INSERT INTO public.plan_ai_limits (plan_id, insights_interval_sec, chat_messages_per_day, chat_enabled)
SELECT id, 14400, 100, true FROM public.plans WHERE slug = 'growth'
ON CONFLICT (plan_id) DO UPDATE SET insights_interval_sec = 14400, chat_messages_per_day = 100, chat_enabled = true;

INSERT INTO public.plan_ai_limits (plan_id, insights_interval_sec, chat_messages_per_day, chat_enabled)
SELECT id, 3600, -1, true FROM public.plans WHERE slug = 'team'
ON CONFLICT (plan_id) DO UPDATE SET insights_interval_sec = 3600, chat_messages_per_day = -1, chat_enabled = true;

INSERT INTO public.plan_ai_limits (plan_id, insights_interval_sec, chat_messages_per_day, chat_enabled)
SELECT id, 0, -1, true FROM public.plans WHERE slug = 'enterprise'
ON CONFLICT (plan_id) DO UPDATE SET insights_interval_sec = 0, chat_messages_per_day = -1, chat_enabled = true;

-- ============================================================
-- TABELA DE USO DIÁRIO DE AI (para rate limiting)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_usage_daily (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  usage_date      date NOT NULL DEFAULT CURRENT_DATE,
  chat_messages   integer NOT NULL DEFAULT 0,
  insights_count  integer NOT NULL DEFAULT 0,
  last_insight_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_ws_date
  ON public.ai_usage_daily(workspace_id, usage_date DESC);

-- ============================================================
-- COUPONS & PROMOTIONS (para incentivo de upgrade)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.coupons (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text NOT NULL UNIQUE,
  stripe_coupon_id  text,
  discount_percent  integer CHECK (discount_percent BETWEEN 1 AND 100),
  discount_amount   integer,
  -- centavos BRL, null se percentual
  currency          text DEFAULT 'brl',
  valid_for_plans   text[],
  -- ex: ARRAY['growth','team']
  max_redemptions   integer,
  times_redeemed    integer NOT NULL DEFAULT 0,
  expires_at        timestamptz,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- VIEW: resumo de uso por workspace (para billing checks)
-- ============================================================

CREATE OR REPLACE VIEW public.v_workspace_usage AS
SELECT
  w.id AS workspace_id,
  w.name AS workspace_name,
  p.slug AS plan_slug,
  p.max_pageviews_month,
  p.max_sites,
  p.max_members,
  COALESCE(site_counts.total_sites, 0) AS current_sites,
  COALESCE(member_counts.total_members, 0) AS current_members,
  COALESCE(pv_counts.pageviews_this_month, 0) AS pageviews_this_month,
  s.status AS subscription_status,
  s.billing_cycle,
  s.trial_end,
  s.current_period_end
FROM public.workspaces w
JOIN public.plans p ON w.plan_id = p.id
LEFT JOIN public.subscriptions s ON s.workspace_id = w.id
LEFT JOIN LATERAL (
  SELECT count(*) AS total_sites
  FROM public.sites
  WHERE workspace_id = w.id AND is_active = true
) site_counts ON true
LEFT JOIN LATERAL (
  SELECT count(*) AS total_members
  FROM public.workspace_members
  WHERE workspace_id = w.id AND is_active = true
) member_counts ON true
LEFT JOIN LATERAL (
  SELECT count(*) AS pageviews_this_month
  FROM public.pageviews pv
  JOIN public.sites st ON pv.site_id = st.id
  WHERE st.workspace_id = w.id
    AND pv.occurred_at >= date_trunc('month', now())
) pv_counts ON true
WHERE w.is_active = true;
