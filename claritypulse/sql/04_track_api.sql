-- ============================================================
-- ClarityPulse — Tracking API: Database Migrations
-- Executar APÓS 01_schema.sql, 02_rls_policies.sql
--
-- Adiciona:
--   1. Partições mensais faltantes para custom_events (2025-2026)
--   2. Tabela page_leaves para dados de engajamento
--   3. Índices adicionais para performance da API de tracking
--   4. Partições para 2026 (pageviews e custom_events)
-- ============================================================

-- ============================================================
-- 1. PARTIÇÕES MENSAIS — custom_events (2025)
-- A tabela 01_schema.sql criou apenas custom_events_2025_01
-- ============================================================

CREATE TABLE IF NOT EXISTS public.custom_events_2025_02 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_03 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_04 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_05 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_06 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_07 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_08 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_09 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_10 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_11 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2025_12 PARTITION OF public.custom_events
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- ============================================================
-- 2. PARTIÇÕES 2026 — custom_events
-- ============================================================

CREATE TABLE IF NOT EXISTS public.custom_events_2026_01 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_02 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_03 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_04 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_05 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_06 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_07 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_08 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_09 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_10 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_11 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE IF NOT EXISTS public.custom_events_2026_12 PARTITION OF public.custom_events
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

-- ============================================================
-- 3. PARTIÇÕES 2026 — pageviews (complementar)
-- 01_schema.sql criou até 2026_01 apenas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pageviews_2026_02 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_03 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_04 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_05 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_06 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_07 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_08 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_09 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_10 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_11 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE IF NOT EXISTS public.pageviews_2026_12 PARTITION OF public.pageviews
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

-- ============================================================
-- 4. TABELA page_leaves — Dados de engajamento por página
-- Armazena tempo de engajamento e scroll depth separados
-- para evitar poluir a tabela pageviews
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_leaves (
  id              uuid NOT NULL DEFAULT gen_random_uuid(),
  site_id         uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  session_hash    bigint NOT NULL,
  page_path       text NOT NULL,
  engagement_time smallint NOT NULL DEFAULT 0,
  -- Tempo de engajamento em segundos (0-86400)
  scroll_depth    smallint NOT NULL DEFAULT 0,
  -- Profundidade máxima do scroll (0-100%)
  country_code    char(2),
  device_type     text,
  occurred_at     timestamptz NOT NULL DEFAULT now()
) PARTITION BY RANGE (occurred_at);

-- Partições page_leaves 2025
CREATE TABLE public.page_leaves_2025_01 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE public.page_leaves_2025_02 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE public.page_leaves_2025_03 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
CREATE TABLE public.page_leaves_2025_04 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');
CREATE TABLE public.page_leaves_2025_05 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-05-01') TO ('2025-06-01');
CREATE TABLE public.page_leaves_2025_06 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
CREATE TABLE public.page_leaves_2025_07 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');
CREATE TABLE public.page_leaves_2025_08 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
CREATE TABLE public.page_leaves_2025_09 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-09-01') TO ('2025-10-01');
CREATE TABLE public.page_leaves_2025_10 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
CREATE TABLE public.page_leaves_2025_11 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
CREATE TABLE public.page_leaves_2025_12 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Partições page_leaves 2026
CREATE TABLE public.page_leaves_2026_01 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE public.page_leaves_2026_02 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE public.page_leaves_2026_03 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE public.page_leaves_2026_04 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE public.page_leaves_2026_05 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE public.page_leaves_2026_06 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE public.page_leaves_2026_07 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE public.page_leaves_2026_08 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE public.page_leaves_2026_09 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE public.page_leaves_2026_10 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE public.page_leaves_2026_11 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE public.page_leaves_2026_12 PARTITION OF public.page_leaves
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

-- Índices page_leaves
CREATE INDEX idx_pl_site_time    ON public.page_leaves(site_id, occurred_at DESC);
CREATE INDEX idx_pl_session      ON public.page_leaves(session_hash, occurred_at);
CREATE INDEX idx_pl_path         ON public.page_leaves(site_id, page_path, occurred_at DESC);

-- RLS para page_leaves
ALTER TABLE public.page_leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_leaves: membros veem"
  ON public.page_leaves FOR SELECT
  USING (public.user_can_access_site(site_id));

-- Permissões para collector_role
GRANT INSERT ON public.page_leaves TO collector_role;

-- ============================================================
-- 5. FUNÇÃO: Criar partições automaticamente para o próximo mês
-- Pode ser agendada via pg_cron para execução mensal
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_monthly_partitions(
  target_month date DEFAULT date_trunc('month', now()) + interval '1 month'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  month_start date := date_trunc('month', target_month);
  month_end   date := month_start + interval '1 month';
  suffix      text := to_char(month_start, 'YYYY_MM');
BEGIN
  -- pageviews
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.pageviews_%s PARTITION OF public.pageviews FOR VALUES FROM (%L) TO (%L)',
    suffix, month_start, month_end
  );

  -- custom_events
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.custom_events_%s PARTITION OF public.custom_events FOR VALUES FROM (%L) TO (%L)',
    suffix, month_start, month_end
  );

  -- page_leaves
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.page_leaves_%s PARTITION OF public.page_leaves FOR VALUES FROM (%L) TO (%L)',
    suffix, month_start, month_end
  );

  -- goal_conversions
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.goal_conversions_%s PARTITION OF public.goal_conversions FOR VALUES FROM (%L) TO (%L)',
    suffix, month_start, month_end
  );

  RAISE NOTICE 'Created partitions for %', suffix;
END;
$$;

-- Agendar criação de partições no dia 25 de cada mês às 02:00
SELECT cron.schedule(
  'create-monthly-partitions',
  '0 2 25 * *',
  $$ SELECT public.create_monthly_partitions(); $$
);

-- ============================================================
-- 6. GRANT adicional para custom_events partitions
-- (as novas partições herdam do parent, mas garantimos)
-- ============================================================

GRANT INSERT ON ALL TABLES IN SCHEMA public TO collector_role;
-- Restringir novamente apenas às tabelas de analytics
REVOKE INSERT ON public.users FROM collector_role;
REVOKE INSERT ON public.workspaces FROM collector_role;
REVOKE INSERT ON public.workspace_members FROM collector_role;
REVOKE INSERT ON public.workspace_invites FROM collector_role;
REVOKE INSERT ON public.sites FROM collector_role;
REVOKE INSERT ON public.subscriptions FROM collector_role;
REVOKE INSERT ON public.payment_events FROM collector_role;
REVOKE INSERT ON public.goals FROM collector_role;
REVOKE INSERT ON public.blocked_ips FROM collector_role;
REVOKE INSERT ON public.api_keys FROM collector_role;
REVOKE INSERT ON public.scheduled_reports FROM collector_role;
REVOKE INSERT ON public.ai_insights FROM collector_role;
REVOKE INSERT ON public.integrations FROM collector_role;
REVOKE INSERT ON public.admin_logs FROM collector_role;
REVOKE INSERT ON public.usage_snapshots FROM collector_role;
REVOKE INSERT ON public.plans FROM collector_role;
