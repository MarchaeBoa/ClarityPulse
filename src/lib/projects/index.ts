import { createClient } from "@/lib/supabase/client";
import type { Project, CreateProjectInput, UpdateProjectInput } from "./types";

export type { Project, CreateProjectInput, UpdateProjectInput };

function getSupabase() {
  return createClient();
}

export async function listProjects(): Promise<Project[]> {
  const sb = getSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await sb
    .from("sites")
    .select("id, name, domain, public_token, is_active, created_at, updated_at, script_verified_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("sites")
    .select("id, name, domain, public_token, is_active, created_at, updated_at, script_verified_at")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const sb = getSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get or create workspace for user
  let { data: workspace } = await sb
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .single();

  if (!workspace) {
    const { data: newWs, error: wsError } = await sb
      .from("workspaces")
      .insert({
        name: "My Workspace",
        slug: user.id.substring(0, 8),
        owner_id: user.id,
      })
      .select("id")
      .single();

    if (wsError) throw new Error(wsError.message);
    workspace = newWs;
  }

  const { data, error } = await sb
    .from("sites")
    .insert({
      workspace_id: workspace!.id,
      name: input.name,
      domain: input.domain.replace(/^https?:\/\//, "").replace(/\/+$/, ""),
    })
    .select("id, name, domain, public_token, is_active, created_at, updated_at, script_verified_at")
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<Project> {
  const sb = getSupabase();
  const updates: Record<string, string> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.domain !== undefined)
    updates.domain = input.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  const { data, error } = await sb
    .from("sites")
    .update(updates)
    .eq("id", id)
    .select("id, name, domain, public_token, is_active, created_at, updated_at, script_verified_at")
    .single();

  if (error) throw new Error(error.message);
  return data as Project;
}

export async function deleteProject(id: string): Promise<void> {
  const sb = getSupabase();
  const { error } = await sb.from("sites").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function generateTrackingScript(publicToken: string, domain: string): string {
  const apiUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/collect`
    : "/api/collect";

  return `<script>
  (function() {
    var d = document, s = d.createElement('script');
    s.async = true;
    s.defer = true;
    s.dataset.token = '${publicToken}';
    s.dataset.api = '${apiUrl}';
    s.src = '${typeof window !== "undefined" ? window.location.origin : ""}/cp.js';
    d.head.appendChild(s);
  })();
</script>`;
}
