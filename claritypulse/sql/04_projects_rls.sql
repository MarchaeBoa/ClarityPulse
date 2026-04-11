-- ============================================================
-- ClarityPulse — RLS Policies for Sites (Projects) CRUD
-- Ensures users can only manage sites within their workspaces
-- ============================================================

-- Enable RLS on sites table (if not already enabled)
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Users can view sites in workspaces they own or are members of
CREATE POLICY "sites_select_policy" ON public.sites
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members
        WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Users can insert sites into workspaces they own
CREATE POLICY "sites_insert_policy" ON public.sites
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

-- Users can update sites in workspaces they own or have admin/editor role
CREATE POLICY "sites_update_policy" ON public.sites
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members
        WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('owner', 'admin', 'editor')
    )
  );

-- Users can delete sites in workspaces they own or have admin role
CREATE POLICY "sites_delete_policy" ON public.sites
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM public.workspace_members
        WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('owner', 'admin')
    )
  );
