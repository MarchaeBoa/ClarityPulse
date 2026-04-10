-- ============================================================
-- ClarityPulse — Manutenção, Retenção de Dados e Particionamento
-- Executar após schema e RLS
-- ============================================================

-- ============================================================
-- FUNÇÃO: Criar partição mensal futura para pageviews
-- Executar via pg_cron no dia 1 de cada mês
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_monthly_partitions(months_ahead integer DEFAULT 3)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_date date;
  partition_start date;
  partition_end date;
  table_suffix text;
  sql_stmt text;
BEGIN
  FOR i IN 0..months_ahead LOOP
    target_date     := date_trunc('month', now() + (i || ' months')::interval)::date;
    partition_start := target_date;
    partition_end   := (target_date + interval '1 month')::date;
    table_suffix    := to_char(target_date, 'YYYY_MM');

    -- pageviews
    sql_stmt := format(
      'CREATE TABLE IF NOT EXISTS public.pageviews_%s
       PARTITION OF public.pageviews
       FOR VALUES FROM (%L) TO (%L)',
      table_suffix, partition_start, partition_end
    );
    EXECUTE sql_stmt;

    -- custom_events
    sql_stmt := format(
      'CREATE TABLE IF NOT EXISTS public.custom_events_%s
       PARTITION OF public.custom_events
       FOR VALUES FROM (%L) TO (%L)',
      table_suffix, partition_start, partition_end
    );
    EXECUTE sql_stmt;

    -- goal_conversions
    sql_stmt := format(
      'CREATE TABLE IF NOT EXISTS public.goal_conversions_%s
       PARTITION OF public.goal_conversions
       FOR VALUES FROM (%L) TO (%L)',
      table_suffix, partition_start, partition_end
    );
    EXECUTE sql_stmt;

    RAISE NOTICE 'Partições criadas para %', table_suffix;
  END LOOP;
END;
$$;

-- Agendar criação automática de partições (dia 1 de cada mês às 00:05)
SELECT cron.schedule(
  'create-monthly-partitions',
  '5 0 1 * *',
  $$ SELECT public.create_monthly_partitions(3); $$
);

-- ============================================================
-- FUNÇÃO: Deletar partições antigas (além da retenção do plano)
-- ============================================================
CREATE OR REPLACE FUNCTION public.drop_old_partitions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ws RECORD;
  site_rec RECORD;
  oldest_allowed date;
  partition_date date;
  table_suffix text;
  tables_to_check text[] := ARRAY['pageviews','custom_events','goal_conversions'];
  tbl text;
BEGIN
  -- Para cada workspace, verificar a retenção do plano
  FOR ws IN
    SELECT w.id, p.data_retention_days
    FROM   public.workspaces w
    JOIN   public.subscriptions s ON s.workspace_id = w.id
    JOIN   public.plans p         ON p.id = s.plan_id
    WHERE  w.is_active = true
  LOOP
    oldest_allowed := (now() - (ws.data_retention_days || ' days')::interval)::date;

    -- Deletar dados antigos via DELETE (não drop da partição — pois vários workspaces compartilham)
    DELETE FROM public.pageviews
    WHERE occurred_at < oldest_allowed
      AND site_id IN (SELECT id FROM public.sites WHERE workspace_id = ws.id);

    DELETE FROM public.custom_events
    WHERE occurred_at < oldest_allowed
      AND site_id IN (SELECT id FROM public.sites WHERE workspace_id = ws.id);

    DELETE FROM public.goal_conversions
    WHERE occurred_at < oldest_allowed
      AND site_id IN (SELECT id FROM public.sites WHERE workspace_id = ws.id);
  END LOOP;

  -- Limpar insights expirados
  DELETE FROM public.ai_insights WHERE expires_at < now();

  -- Limpar convites expirados sem aceite
  DELETE FROM public.workspace_invites
  WHERE expires_at < now() AND accepted_at IS NULL;

  RAISE NOTICE 'Limpeza de dados concluída em %', now();
END;
$$;

-- Agendar limpeza diária às 02:00 UTC
SELECT cron.schedule(
  'purge-old-data',
  '0 2 * * *',
  $$ SELECT public.drop_old_partitions(); $$
);

-- ============================================================
-- FUNÇÃO: Snapshot diário de uso por workspace
-- ============================================================
CREATE OR REPLACE FUNCTION public.take_daily_usage_snapshot()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ws RECORD;
  pv_count bigint;
  ev_count bigint;
  sites_cnt integer;
  members_cnt integer;
  today date := current_date;
BEGIN
  FOR ws IN SELECT id FROM public.workspaces WHERE is_active = true LOOP
    -- Pageviews do mês atual
    SELECT count(*) INTO pv_count
    FROM public.pageviews
    WHERE occurred_at >= date_trunc('month', now())
      AND site_id IN (SELECT id FROM public.sites WHERE workspace_id = ws.id);

    -- Custom events do mês atual
    SELECT count(*) INTO ev_count
    FROM public.custom_events
    WHERE occurred_at >= date_trunc('month', now())
      AND site_id IN (SELECT id FROM public.sites WHERE workspace_id = ws.id);

    -- Sites ativos
    SELECT count(*) INTO sites_cnt
    FROM public.sites
    WHERE workspace_id = ws.id AND is_active = true;

    -- Membros ativos
    SELECT count(*) INTO members_cnt
    FROM public.workspace_members
    WHERE workspace_id = ws.id AND is_active = true;

    INSERT INTO public.usage_snapshots
      (workspace_id, snapshot_date, pageviews_count, custom_events_count, sites_count, members_count)
    VALUES
      (ws.id, today, pv_count, ev_count, sites_cnt, members_cnt)
    ON CONFLICT (workspace_id, snapshot_date)
    DO UPDATE SET
      pageviews_count     = EXCLUDED.pageviews_count,
      custom_events_count = EXCLUDED.custom_events_count,
      sites_count         = EXCLUDED.sites_count,
      members_count       = EXCLUDED.members_count;
  END LOOP;

  RAISE NOTICE 'Snapshots de uso atualizados para %', today;
END;
$$;

-- Agendar snapshot diário à meia-noite e 1 minuto UTC
SELECT cron.schedule(
  'daily-usage-snapshot',
  '1 0 * * *',
  $$ SELECT public.take_daily_usage_snapshot(); $$
);

-- ============================================================
-- FUNÇÃO: Verificar limite de pageviews do plano
-- Retorna true se o workspace ainda está dentro do limite
-- ============================================================
CREATE OR REPLACE FUNCTION public.workspace_within_quota(ws_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    CASE
      WHEN p.max_pageviews_month = -1 THEN true  -- ilimitado
      ELSE COALESCE(u.pageviews_count, 0) < p.max_pageviews_month
    END
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  LEFT JOIN public.usage_snapshots u ON u.workspace_id = ws_id
    AND u.snapshot_date = current_date
  WHERE s.workspace_id = ws_id
  LIMIT 1;
$$;

-- ============================================================
-- FUNÇÃO: Anonimizar dados de usuário deletado (LGPD)
-- ============================================================
CREATE OR REPLACE FUNCTION public.anonymize_deleted_user(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Marcar usuário como deletado
  UPDATE public.users
  SET
    is_deleted  = true,
    deleted_at  = now(),
    full_name   = 'Usuário removido',
    avatar_url  = NULL,
    updated_at  = now()
  WHERE id = user_id_param;

  -- Anonimizar referências em admin_logs (manter logs, remover identificação)
  UPDATE public.admin_logs
  SET actor_id = NULL
  WHERE actor_id = user_id_param;

  -- Transferir workspaces owned para NULL ou outro admin
  -- (deve ser tratado no nível da aplicação antes de chamar esta função)

  -- Desativar memberships
  UPDATE public.workspace_members
  SET is_active = false
  WHERE user_id = user_id_param;

  -- Remover API keys
  UPDATE public.api_keys
  SET is_active = false
  WHERE created_by = user_id_param;

  RAISE NOTICE 'Usuário % anonimizado com sucesso', user_id_param;
END;
$$;

-- ============================================================
-- QUERIES DE MONITORAMENTO
-- Usar para health check do banco
-- ============================================================

-- Tamanho das tabelas principais
-- SELECT
--   relname AS tabela,
--   pg_size_pretty(pg_total_relation_size(relid)) AS tamanho_total,
--   pg_size_pretty(pg_relation_size(relid)) AS tamanho_dados
-- FROM pg_catalog.pg_statio_user_tables
-- ORDER BY pg_total_relation_size(relid) DESC
-- LIMIT 20;

-- Pageviews por dia (últimos 7 dias)
-- SELECT
--   date_trunc('day', occurred_at) AS dia,
--   count(*) AS pageviews
-- FROM public.pageviews
-- WHERE occurred_at > now() - interval '7 days'
-- GROUP BY dia
-- ORDER BY dia DESC;

-- Workspaces próximos do limite do plano (>80%)
-- SELECT
--   w.name,
--   p.slug AS plano,
--   u.pageviews_count,
--   p.max_pageviews_month,
--   round(u.pageviews_count::numeric / p.max_pageviews_month * 100, 1) AS pct_uso
-- FROM public.usage_snapshots u
-- JOIN public.workspaces w ON w.id = u.workspace_id
-- JOIN public.subscriptions s ON s.workspace_id = w.id
-- JOIN public.plans p ON p.id = s.plan_id
-- WHERE u.snapshot_date = current_date
--   AND p.max_pageviews_month > 0
--   AND u.pageviews_count::numeric / p.max_pageviews_month > 0.8
-- ORDER BY pct_uso DESC;
