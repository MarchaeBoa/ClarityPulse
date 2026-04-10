-- ============================================================
-- ClarityPulse — Row Level Security (RLS) Policies
-- Executar APÓS o schema principal (01_schema.sql)
-- ============================================================

-- ============================================================
-- HABILITAR RLS EM TODAS AS TABELAS
-- ============================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pageviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_conversions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_snapshots   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FUNÇÃO HELPER — Role do usuário no workspace
-- ============================================================
CREATE OR REPLACE FUNCTION public.user_workspace_role(ws_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.workspace_members
  WHERE workspace_id = ws_id
    AND user_id      = auth.uid()
    AND is_active    = true
  LIMIT 1;
$$;

-- ============================================================
-- FUNÇÃO HELPER — Verificar se usuário é membro de workspace via site
-- ============================================================
CREATE OR REPLACE FUNCTION public.user_can_access_site(s_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.sites st
    JOIN   public.workspace_members wm ON wm.workspace_id = st.workspace_id
    WHERE  st.id       = s_id
      AND  wm.user_id  = auth.uid()
      AND  wm.is_active = true
  );
$$;

-- ============================================================
-- USERS
-- ============================================================
CREATE POLICY "users: ver próprio perfil"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR is_deleted = false);

CREATE POLICY "users: atualizar próprio perfil"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- WORKSPACES
-- ============================================================
CREATE POLICY "workspaces: membros veem"
  ON public.workspaces FOR SELECT
  USING (public.user_workspace_role(id) IS NOT NULL);

CREATE POLICY "workspaces: owner/admin atualizam"
  ON public.workspaces FOR UPDATE
  USING (public.user_workspace_role(id) IN ('owner', 'admin'));

CREATE POLICY "workspaces: owner deleta"
  ON public.workspaces FOR DELETE
  USING (public.user_workspace_role(id) = 'owner');

CREATE POLICY "workspaces: qualquer autenticado cria"
  ON public.workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
CREATE POLICY "members: membros veem lista"
  ON public.workspace_members FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

CREATE POLICY "members: owner/admin gerenciam"
  ON public.workspace_members FOR ALL
  USING (public.user_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ============================================================
-- WORKSPACE INVITES
-- ============================================================
CREATE POLICY "invites: membros veem"
  ON public.workspace_invites FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

CREATE POLICY "invites: admin cria"
  ON public.workspace_invites FOR INSERT
  WITH CHECK (public.user_workspace_role(workspace_id) IN ('owner', 'admin'));

CREATE POLICY "invites: admin revoga"
  ON public.workspace_invites FOR UPDATE
  USING (public.user_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ============================================================
-- SITES
-- ============================================================
CREATE POLICY "sites: membros veem"
  ON public.sites FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

CREATE POLICY "sites: editor+ cria"
  ON public.sites FOR INSERT
  WITH CHECK (
    public.user_workspace_role(workspace_id) IN ('owner', 'admin', 'editor')
  );

CREATE POLICY "sites: editor+ atualiza"
  ON public.sites FOR UPDATE
  USING (
    public.user_workspace_role(workspace_id) IN ('owner', 'admin', 'editor')
  );

CREATE POLICY "sites: admin+ deleta"
  ON public.sites FOR DELETE
  USING (public.user_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE POLICY "subscriptions: membros veem"
  ON public.subscriptions FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

CREATE POLICY "subscriptions: owner atualiza"
  ON public.subscriptions FOR UPDATE
  USING (public.user_workspace_role(workspace_id) = 'owner');

-- ============================================================
-- PAGEVIEWS
-- ============================================================
CREATE POLICY "pageviews: membros veem"
  ON public.pageviews FOR SELECT
  USING (public.user_can_access_site(site_id));

-- INSERT apenas via service_role (endpoint /collect)
-- Nenhuma policy de INSERT para usuários normais

-- ============================================================
-- CUSTOM EVENTS
-- ============================================================
CREATE POLICY "custom_events: membros veem"
  ON public.custom_events FOR SELECT
  USING (public.user_can_access_site(site_id));

-- ============================================================
-- GOALS
-- ============================================================
CREATE POLICY "goals: membros veem"
  ON public.goals FOR SELECT
  USING (public.user_can_access_site(site_id));

CREATE POLICY "goals: editor+ gerencia"
  ON public.goals FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM   public.sites st
      JOIN   public.workspace_members wm ON wm.workspace_id = st.workspace_id
      WHERE  st.id       = goals.site_id
        AND  wm.user_id  = auth.uid()
        AND  wm.is_active = true
        AND  wm.role      IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================
-- GOAL CONVERSIONS
-- ============================================================
CREATE POLICY "goal_conversions: membros veem"
  ON public.goal_conversions FOR SELECT
  USING (public.user_can_access_site(site_id));

-- ============================================================
-- BLOCKED IPS
-- ============================================================
CREATE POLICY "blocked_ips: membros veem"
  ON public.blocked_ips FOR SELECT
  USING (public.user_can_access_site(site_id));

CREATE POLICY "blocked_ips: admin+ gerencia"
  ON public.blocked_ips FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM   public.sites st
      JOIN   public.workspace_members wm ON wm.workspace_id = st.workspace_id
      WHERE  st.id       = blocked_ips.site_id
        AND  wm.user_id  = auth.uid()
        AND  wm.is_active = true
        AND  wm.role      IN ('owner', 'admin')
    )
  );

-- ============================================================
-- API KEYS
-- ============================================================
CREATE POLICY "api_keys: membros veem"
  ON public.api_keys FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

CREATE POLICY "api_keys: admin+ gerencia"
  ON public.api_keys FOR ALL
  USING (public.user_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ============================================================
-- SCHEDULED REPORTS
-- ============================================================
CREATE POLICY "scheduled_reports: membros veem"
  ON public.scheduled_reports FOR SELECT
  USING (public.user_can_access_site(site_id));

CREATE POLICY "scheduled_reports: editor+ gerencia"
  ON public.scheduled_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM   public.sites st
      JOIN   public.workspace_members wm ON wm.workspace_id = st.workspace_id
      WHERE  st.id       = scheduled_reports.site_id
        AND  wm.user_id  = auth.uid()
        AND  wm.is_active = true
        AND  wm.role      IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================================
-- AI INSIGHTS
-- ============================================================
CREATE POLICY "ai_insights: membros veem"
  ON public.ai_insights FOR SELECT
  USING (public.user_can_access_site(site_id));

CREATE POLICY "ai_insights: membros marcam como lido"
  ON public.ai_insights FOR UPDATE
  USING (public.user_can_access_site(site_id));

-- ============================================================
-- INTEGRATIONS
-- ============================================================
CREATE POLICY "integrations: membros veem"
  ON public.integrations FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

CREATE POLICY "integrations: admin+ gerencia"
  ON public.integrations FOR ALL
  USING (public.user_workspace_role(workspace_id) IN ('owner', 'admin'));

-- ============================================================
-- USAGE SNAPSHOTS
-- ============================================================
CREATE POLICY "usage_snapshots: membros veem"
  ON public.usage_snapshots FOR SELECT
  USING (public.user_workspace_role(workspace_id) IS NOT NULL);

-- ============================================================
-- SERVICE ROLE: permissões especiais para o endpoint /collect
-- Executar com service_role key no backend de ingestão
-- ============================================================
-- O service role bypassa RLS por padrão no Supabase.
-- Criar uma role dedicada com permissão apenas de INSERT:

CREATE ROLE collector_role;
GRANT INSERT ON public.pageviews TO collector_role;
GRANT INSERT ON public.custom_events TO collector_role;
GRANT SELECT ON public.sites TO collector_role;
GRANT SELECT ON public.blocked_ips TO collector_role;

-- IMPORTANTE: o endpoint de coleta NUNCA deve ter permissão
-- de SELECT em pageviews/custom_events — apenas INSERT.
