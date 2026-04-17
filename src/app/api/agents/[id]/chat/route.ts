import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { chat } from "@/lib/ai";

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

// POST /api/agents/:id/chat
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { messages } = await request.json();

  const { data: agent } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (!agent) {
    return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
  }

  const systemMessage = agent.system_prompt
    ? agent.system_prompt
    : `Você é ${agent.name}, um assistente de atendimento ao cliente. Seja educado, profissional e objetivo.`;

  try {
    const { reply, tokensUsed } = await chat(
      agent.model || "gpt-4o-mini",
      [{ role: "system", content: systemMessage }, ...messages]
    );

    return NextResponse.json({ reply, tokensUsed });
  } catch (err: unknown) {
    console.error("AI error:", err);
    const message = err instanceof Error ? err.message : "Erro na API de IA";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
