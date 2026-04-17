import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

async function getTenantId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabaseAdmin
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  return data?.tenant_id ?? null;
}

// GET /api/agents/:id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .select("*, channels(*), trainings(*)")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !agent) {
    return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
  }

  return NextResponse.json(agent);
}

// PATCH /api/agents/:id
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Verify agent belongs to tenant
  const { data: existing } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.model !== undefined) updateData.model = body.model;
  if (body.tone !== undefined) updateData.tone = body.tone;
  if (body.systemPrompt !== undefined) updateData.system_prompt = body.systemPrompt;
  if (body.active !== undefined) updateData.active = body.active;
  if (body.avatarUrl !== undefined) updateData.avatar_url = body.avatarUrl;
  if (body.behavior !== undefined) updateData.behavior = body.behavior;

  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(agent);
}

// DELETE /api/agents/:id
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: existing } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
  }

  await supabaseAdmin.from("agents").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
