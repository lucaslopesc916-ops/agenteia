import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { connectInstance, getInstanceStatus } from "@/lib/stevo";

async function getTenantId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabaseAdmin
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();
  return data?.tenant_id ?? null;
}

// GET /api/channels/stevo — check connection status
export async function GET() {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getInstanceStatus();
    return NextResponse.json({
      connected: status?.data?.Connected && status?.data?.LoggedIn,
      name: status?.data?.Name || null,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}

// POST /api/channels/stevo — connect WhatsApp channel to an agent
export async function POST(request: Request) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agentId } = await request.json();
  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  const { data: agent } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("id", agentId)
    .eq("tenant_id", tenantId)
    .single();

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Connect instance with webhook
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/webhook/stevo`;
  const instance = await connectInstance(webhookUrl);

  if (instance?.message !== "success") {
    return NextResponse.json({ error: "Stevo instance not connected" }, { status: 502 });
  }

  const phone = instance.data?.jid?.split("@")[0] || null;

  // Upsert channel record
  const { data: existingChannel } = await supabaseAdmin
    .from("channels")
    .select("id")
    .eq("agent_id", agentId)
    .eq("type", "whatsapp")
    .single();

  let channel;
  if (existingChannel) {
    const { data } = await supabaseAdmin
      .from("channels")
      .update({
        active: true,
        credentials: { provider: "stevo", phone, webhookUrl },
      })
      .eq("id", existingChannel.id)
      .select()
      .single();
    channel = data;
  } else {
    const { data } = await supabaseAdmin
      .from("channels")
      .insert({
        agent_id: agentId,
        type: "whatsapp",
        active: true,
        credentials: { provider: "stevo", phone, webhookUrl },
      })
      .select()
      .single();
    channel = data;
  }

  return NextResponse.json({ channel, phone, connected: true });
}

// DELETE /api/channels/stevo — disconnect channel
export async function DELETE(request: Request) {
  const tenantId = await getTenantId();
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agentId } = await request.json();

  const { data: agent } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("id", agentId)
    .eq("tenant_id", tenantId)
    .single();

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  await supabaseAdmin
    .from("channels")
    .update({ active: false })
    .eq("agent_id", agentId)
    .eq("type", "whatsapp");

  // Remove webhook
  await connectInstance("");

  return NextResponse.json({ disconnected: true });
}
