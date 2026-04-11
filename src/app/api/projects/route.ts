import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/projects — list all projects for the current user
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's workspace(s)
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { data: ownedWs } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id);

  const workspaceIds = [
    ...(ownedWs ?? []).map((w) => w.id),
    ...(memberships ?? []).map((m) => m.workspace_id),
  ];

  const uniqueWsIds = Array.from(new Set(workspaceIds));

  if (uniqueWsIds.length === 0) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("sites")
    .select(
      "id, name, domain, public_token, is_active, created_at, updated_at, script_verified_at"
    )
    .in("workspace_id", uniqueWsIds)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/projects — create a new project
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, domain } = body;

  if (!name || !domain) {
    return NextResponse.json(
      { error: "Name and domain are required" },
      { status: 400 }
    );
  }

  // Get or create workspace
  let { data: workspace } = await supabase
    .from("workspaces")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .single();

  if (!workspace) {
    const slug = `ws-${user.id.substring(0, 8)}-${Date.now().toString(36)}`;
    const { data: newWs, error: wsError } = await supabase
      .from("workspaces")
      .insert({
        name: "My Workspace",
        slug,
        owner_id: user.id,
      })
      .select("id")
      .single();

    if (wsError) {
      return NextResponse.json({ error: wsError.message }, { status: 500 });
    }
    workspace = newWs;
  }

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  const { data, error } = await supabase
    .from("sites")
    .insert({
      workspace_id: workspace!.id,
      name,
      domain: cleanDomain,
    })
    .select(
      "id, name, domain, public_token, is_active, created_at, updated_at, script_verified_at"
    )
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A site with this domain already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
