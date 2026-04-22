-- ============================================================
-- ClarityPulse — Schema PostgreSQL Completo
-- Compatível com Supabase / PostgreSQL 15+
-- Versão: 1.0.0
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================================
-- DOMÍNIO: BILLING — PLANOS
-- ============================================================

CREATE TABLE public.plans (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    text NOT NULL,
  slug                    text NOT NULL UNIQUE,
  -- 'starter' | 'growth' | 'team' | 'enterprise'
  max_sites               integer NOT NULL DEFAULT 1,
  -- -1 = ilimitado
  max_pageviews_month     bigint NOT NULL DEFAULT 10000,
  max_members             integer NOT NULL DEFAULT 1,
  data_retention_days     integer NOT NULL DEFAULT 90,
  has_ai_insights         boolean NOT NULL DEFAULT false,
  has_session_replay      boolean NOT NULL DEFAULT false,
  has_whitelabel          boolean NOT NULL DEFAULT false,
  has_api_access          boolean NOT NULL DEFAULT false,
  has_scheduled_reports   boolean NOT NULL DEFAULT false,
  has_custom_events       boolean NOT NULL DEFAULT false,
  features                jsonb NOT NULL DEFAULT '[]',
  price_brl_monthly       integer,
  -- centavos, NULL = gratuito
  price_brl_yearly        integer,
  stripe_price_id_monthly text,
  stripe_price_id_yearly  text,
  is_active               boolean NOT NULL DEFAULT true,
  sort_order              integer NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- Planos padrão
INSERT INTO public.plans (name, slug, max_sites, max_pageviews_month, max_members,
  data_retention_days, has_ai_insights, has_api_access, has_scheduled_reports,
  has_custom_events, price_brl_monthly, price_brl_yearly, sort_order)
VALUES
  ('Starter',    'starter',    3,  100000,   2,  365, true,  false, true,  true,  4900,    39000,   1),
  ('Pro',        'pro',        10, 1000000,  10, 730, true,  true,  true,  true,  14900,   119000,  2),
  ('Agency',     'agency',     -1, 5000000,  -1, 1095,true,  true,  true,  true,  39900,   319000,  3),
  ('Enterprise', 'enterprise', -1, -1,       -1, 1825,true,  true,  true,  true,  NULL,    NULL,    4);

-- ============================================================
-- DOMÍNIO: IDENTIDADE
-- ============================================================

CREATE TABLE public.users (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          text NOT NULL UNIQUE,
  full_name      text,
  avatar_url     text,
  auth_provider  text NOT NULL DEFAULT 'email',
  -- 'email' | 'google' | 'github'
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  last_sign_in   timestamptz,
  is_deleted     boolean NOT NULL DEFAULT false,
  deleted_at     timestamptz
);

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- DOMÍNIO: ORGANIZAÇÃO — WORKSPACES
-- ============================================================

CREATE TABLE public.workspaces (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  slug              text NOT NULL UNIQUE,
  owner_id          uuid NOT NULL REFERENCES public.users(id),
  plan_id           uuid REFERENCES public.plans(id),
  settings          jsonb NOT NULL DEFAULT '{}',
  timezone          text NOT NULL DEFAULT 'America/Sao_Paulo',
  logo_url          text,
  whitelabel_domain text,
  -- ex: analytics.agencia.com.br
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  trial_ends_at     timestamptz,
  is_active         boolean NOT NULL DEFAULT true
);

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Associar plano Starter (trial) ao criar workspace
CREATE OR REPLACE FUNCTION public.assign_default_plan()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.plan_id IS NULL THEN
    SELECT id INTO NEW.plan_id FROM public.plans WHERE slug = 'starter' LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER workspaces_assign_plan
  BEFORE INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_plan();

-- ============================================================
-- DOMÍNIO: MEMBROS E PERMISSÕES
-- ============================================================

CREATE TABLE public.workspace_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role          text NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  invited_by    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  joined_at     timestamptz NOT NULL DEFAULT now(),
  is_active     boolean NOT NULL DEFAULT true,
  UNIQUE (workspace_id, user_id)
);

CREATE TABLE public.workspace_invites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email         text NOT NULL,
  role          text NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  token         text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by    uuid NOT NULL REFERENCES public.users(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL DEFAULT now() + interval '7 days',
  accepted_at   timestamptz,
  revoked_at    timestamptz
);

-- ============================================================
-- DOMÍNIO: SITES
-- ============================================================

CREATE TABLE public.sites (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  domain               text NOT NULL,
  public_token         text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  timezone             text NOT NULL DEFAULT 'America/Sao_Paulo',
  allowed_domains      text[],
  settings             jsonb NOT NULL DEFAULT '{}',
  is_active            boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  script_verified_at   timestamptz,
  UNIQUE (workspace_id, domain)
);

CREATE TRIGGER sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- DOMÍNIO: BILLING — ASSINATURAS
-- ============================================================

CREATE TABLE public.subscriptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id             uuid NOT NULL UNIQUE REFERENCES public.workspaces(id),
  plan_id                  uuid NOT NULL REFERENCES public.plans(id),
  stripe_subscription_id   text UNIQUE,
  stripe_customer_id       text,
  status                   text NOT NULL DEFAULT 'trialing'
    CHECK (status IN ('trialing','active','past_due','canceled','unpaid','paused')),
  billing_cycle            text NOT NULL DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly','yearly')),
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  trial_end                timestamptz,
  canceled_at              timestamptz,
  cancel_at_period_end     boolean NOT NULL DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Criar subscription em trial (Starter) automaticamente ao criar workspace
CREATE OR REPLACE FUNCTION public.create_trial_subscription()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  default_plan_id uuid;
BEGIN
  SELECT id INTO default_plan_id FROM public.plans WHERE slug = 'starter' LIMIT 1;
  INSERT INTO public.subscriptions (workspace_id, plan_id, status, trial_end)
  VALUES (NEW.id, default_plan_id, 'trialing', now() + interval '14 days');
  RETURN NEW;
END;
$$;

CREATE TRIGGER workspaces_create_subscription
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.create_trial_subscription();

CREATE TABLE public.payment_events (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       uuid REFERENCES public.workspaces(id) ON DELETE SET NULL,
  stripe_event_id    text NOT NULL UNIQUE,
  event_type         text NOT NULL,
  amount_brl         integer,
  currency           text DEFAULT 'brl',
  stripe_payload     jsonb NOT NULL,
  processed_at       timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- DOMÍNIO: ANALYTICS — PAGEVIEWS (PARTICIONADA)
-- ============================================================

CREATE TABLE public.pageviews (
  id               uuid NOT NULL DEFAULT gen_random_uuid(),
  site_id          uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  session_hash     bigint NOT NULL,
  page_url         text NOT NULL,
  page_path        text NOT NULL,
  page_query       text,
  referrer         text,
  referrer_domain  text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_content      text,
  utm_term         text,
  country_code     char(2),
  region           text,
  city             text,
  device_type      text CHECK (device_type IN ('mobile','desktop','tablet','bot')),
  os               text,
  os_version       text,
  browser          text,
  browser_version  text,
  viewport_width   smallint,
  viewport_height  smallint,
  duration_sec     smallint,
  is_bounce        boolean,
  is_entry         boolean NOT NULL DEFAULT true,
  is_exit          boolean,
  occurred_at      timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);

-- Partições mensais (criar script para automatizar)
CREATE TABLE public.pageviews_2025_01 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE public.pageviews_2025_02 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE public.pageviews_2025_03 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE public.pageviews_2025_04 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE public.pageviews_2025_05 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE public.pageviews_2025_06 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE public.pageviews_2025_07 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE public.pageviews_2025_08 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE public.pageviews_2025_09 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE public.pageviews_2025_10 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE public.pageviews_2025_11 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE public.pageviews_2025_12 PARTITION OF public.pageviews
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
CREATE TABLE public.pageviews_2026_01 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- ============================================================
-- DOMÍNIO: ANALYTICS — CUSTOM EVENTS (PARTICIONADA)
-- ============================================================

CREATE TABLE public.custom_events (
  id            uuid NOT NULL DEFAULT gen_random_uuid(),
  site_id       uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  session_hash  bigint NOT NULL,
  event_name    text NOT NULL,
  page_url      text NOT NULL,
  page_path     text NOT NULL,
  properties    jsonb,
  country_code  char(2),
  device_type   text,
  occurred_at   timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);

CREATE TABLE public.custom_events_2025_01 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- (demais meses: mesmo padrão das pageviews)

-- ============================================================
-- DOMÍNIO: METAS E CONVERSÕES
-- ============================================================

CREATE TABLE public.goals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name            text NOT NULL,
  goal_type       text NOT NULL
    CHECK (goal_type IN ('url','event','funnel')),
  match_value     text,
  match_operator  text DEFAULT 'equals'
    CHECK (match_operator IN ('equals','contains','starts_with','regex')),
  event_filters   jsonb,
  funnel_steps    jsonb,
  currency        text DEFAULT 'BRL',
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE public.goal_conversions (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  goal_id         uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  site_id         uuid NOT NULL,
  session_hash    bigint NOT NULL,
  page_url        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  referrer_domain text,
  country_code    char(2),
  device_type     text,
  revenue         numeric(12,2),
  occurred_at     timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);

CREATE TABLE public.goal_conversions_2025_01 PARTITION OF public.goal_conversions
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- (demais meses: mesmo padrão)

-- ============================================================
-- DOMÍNIO: SEGURANÇA
-- ============================================================

CREATE TABLE public.blocked_ips (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id      uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  ip_cidr      text NOT NULL,
  note         text,
  created_by   uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (site_id, ip_cidr)
);

CREATE TABLE public.api_keys (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name          text NOT NULL,
  key_hash      text NOT NULL UNIQUE,
  key_prefix    text NOT NULL,
  scope         text[] NOT NULL DEFAULT ARRAY['read'],
  created_by    uuid REFERENCES public.users(id) ON DELETE SET NULL,
  last_used_at  timestamptz,
  expires_at    timestamptz,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- DOMÍNIO: FEATURES
-- ============================================================

CREATE TABLE public.scheduled_reports (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id          uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  created_by       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name             text NOT NULL,
  frequency        text NOT NULL
    CHECK (frequency IN ('daily','weekly','monthly')),
  send_day         smallint CHECK (send_day BETWEEN 0 AND 6),
  send_hour        smallint NOT NULL DEFAULT 8 CHECK (send_hour BETWEEN 0 AND 23),
  format           text NOT NULL DEFAULT 'email'
    CHECK (format IN ('email','pdf','csv')),
  recipient_emails text[] NOT NULL,
  report_config    jsonb NOT NULL DEFAULT '{}',
  last_sent_at     timestamptz,
  next_send_at     timestamptz NOT NULL,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_insights (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id         uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  insight_type    text NOT NULL
    CHECK (insight_type IN ('trend','anomaly','suggestion','summary','weekly')),
  title           text NOT NULL,
  content         text NOT NULL,
  severity        text DEFAULT 'info'
    CHECK (severity IN ('info','warning','positive')),
  context_data    jsonb,
  model_version   text,
  generated_at    timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  was_read        boolean NOT NULL DEFAULT false,
  was_dismissed   boolean NOT NULL DEFAULT false
);

CREATE TABLE public.integrations (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  provider           text NOT NULL
    CHECK (provider IN ('slack','zapier','make','n8n','google_ads','meta_ads','tiktok_ads')),
  status             text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','active','error','revoked')),
  config_encrypted   bytea,
  last_sync_result   jsonb,
  error_message      text,
  last_synced_at     timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, provider)
);

-- ============================================================
-- DOMÍNIO: AUDITORIA E OPERAÇÕES
-- ============================================================

CREATE TABLE public.admin_logs (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id       uuid REFERENCES public.users(id) ON DELETE SET NULL,
  workspace_id   uuid,
  action         text NOT NULL,
  resource_type  text,
  resource_id    uuid,
  old_value      jsonb,
  new_value      jsonb,
  ip_address     inet,
  user_agent     text,
  occurred_at    timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);

CREATE TABLE public.admin_logs_2025 PARTITION OF public.admin_logs
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE public.admin_logs_2026 PARTITION OF public.admin_logs
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE TABLE public.usage_snapshots (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  snapshot_date       date NOT NULL,
  pageviews_count     bigint NOT NULL DEFAULT 0,
  custom_events_count bigint NOT NULL DEFAULT 0,
  sites_count         integer NOT NULL DEFAULT 0,
  members_count       integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, snapshot_date)
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- workspaces
CREATE INDEX idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX idx_workspaces_slug  ON public.workspaces(slug);

-- workspace_members
CREATE INDEX idx_wm_user      ON public.workspace_members(user_id)       WHERE is_active = true;
CREATE INDEX idx_wm_workspace  ON public.workspace_members(workspace_id)  WHERE is_active = true;

-- sites
CREATE INDEX idx_sites_workspace ON public.sites(workspace_id) WHERE is_active = true;
CREATE INDEX idx_sites_token     ON public.sites(public_token);

-- pageviews
CREATE INDEX idx_pv_site_time    ON public.pageviews(site_id, occurred_at DESC);
CREATE INDEX idx_pv_session      ON public.pageviews(session_hash, occurred_at);
CREATE INDEX idx_pv_path         ON public.pageviews(site_id, page_path, occurred_at DESC);
CREATE INDEX idx_pv_referrer     ON public.pageviews(site_id, referrer_domain, occurred_at DESC);
CREATE INDEX idx_pv_country      ON public.pageviews(site_id, country_code, occurred_at DESC);
CREATE INDEX idx_pv_device       ON public.pageviews(site_id, device_type, occurred_at DESC);
CREATE INDEX idx_pv_utm_campaign ON public.pageviews(site_id, utm_campaign, occurred_at DESC)
  WHERE utm_campaign IS NOT NULL;

-- custom_events
CREATE INDEX idx_ce_site_name  ON public.custom_events(site_id, event_name, occurred_at DESC);
CREATE INDEX idx_ce_session    ON public.custom_events(session_hash, occurred_at);
CREATE INDEX idx_ce_properties ON public.custom_events USING GIN (properties);

-- goals
CREATE INDEX idx_goals_site   ON public.goals(site_id) WHERE is_active = true;
CREATE INDEX idx_gc_goal_time ON public.goal_conversions(goal_id, occurred_at DESC);
CREATE INDEX idx_gc_site_time ON public.goal_conversions(site_id, occurred_at DESC);

-- api_keys
CREATE INDEX idx_ak_workspace ON public.api_keys(workspace_id) WHERE is_active = true;

-- ai_insights
CREATE INDEX idx_ai_site_active ON public.ai_insights(site_id, expires_at)
  WHERE was_dismissed = false;

-- admin_logs
CREATE INDEX idx_al_workspace ON public.admin_logs(workspace_id, occurred_at DESC);
CREATE INDEX idx_al_actor     ON public.admin_logs(actor_id, occurred_at DESC);

-- usage_snapshots
CREATE INDEX idx_us_workspace_date ON public.usage_snapshots(workspace_id, snapshot_date DESC);

-- ============================================================
-- MATERIALIZED VIEWS (cache de queries frequentes)
-- ============================================================

CREATE MATERIALIZED VIEW mv_daily_pageviews AS
SELECT
  site_id,
  date_trunc('day', occurred_at AT TIME ZONE 'UTC') AS day,
  count(*)                                                          AS pageviews,
  count(DISTINCT session_hash)                                      AS sessions,
  count(DISTINCT session_hash) FILTER (WHERE is_bounce = true)     AS bounces,
  count(DISTINCT session_hash) FILTER (WHERE is_entry = true)      AS entries
FROM public.pageviews
WHERE occurred_at >= now() - interval '90 days'
GROUP BY site_id, day;

CREATE UNIQUE INDEX ON mv_daily_pageviews(site_id, day);

CREATE MATERIALIZED VIEW mv_top_pages AS
SELECT
  site_id,
  page_path,
  date_trunc('day', occurred_at)  AS day,
  count(*)                        AS pageviews,
  count(DISTINCT session_hash)    AS sessions,
  avg(duration_sec)               AS avg_duration
FROM public.pageviews
WHERE occurred_at >= now() - interval '90 days'
  AND page_path IS NOT NULL
GROUP BY site_id, page_path, day;

CREATE UNIQUE INDEX ON mv_top_pages(site_id, page_path, day);

CREATE MATERIALIZED VIEW mv_referrers AS
SELECT
  site_id,
  coalesce(utm_source, referrer_domain, 'direct') AS source,
  utm_medium,
  utm_campaign,
  date_trunc('day', occurred_at)                  AS day,
  count(*)                                        AS pageviews,
  count(DISTINCT session_hash)                    AS sessions
FROM public.pageviews
WHERE occurred_at >= now() - interval '90 days'
GROUP BY site_id, source, utm_medium, utm_campaign, day;

-- Refresh automático via pg_cron (a cada 5 minutos)
SELECT cron.schedule(
  'refresh-materialized-views',
  '*/5 * * * *',
  $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_pageviews;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_top_pages;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_referrers;
  $$
);
