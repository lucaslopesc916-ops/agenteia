import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

function generateId() {
  return "c" + randomBytes(12).toString("base64url").toLowerCase().slice(0, 24);
}

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

// GET /api/agents
export async function GET() {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: agents, error } = await supabaseAdmin
    .from("agents")
    .select("*, channels(type)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Count conversations per agent
  const agentsWithCount = await Promise.all(
    (agents || []).map(async (agent) => {
      const { count } = await supabaseAdmin
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("agent_id", agent.id);

      return {
        ...agent,
        _count: { conversations: count || 0 },
      };
    })
  );

  return NextResponse.json(agentsWithCount);
}

// POST /api/agents
export async function POST(request: Request) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, model, tone, systemPrompt } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Nome do agente é obrigatório" },
      { status: 400 }
    );
  }

  const { data: agent, error } = await supabaseAdmin
    .from("agents")
    .insert({
      id: generateId(),
      tenant_id: tenantId,
      name,
      model: model || "gpt-4o-mini",
      tone: tone || "professional",
      system_prompt: systemPrompt || "",
      active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(agent, { status: 201 });
}
