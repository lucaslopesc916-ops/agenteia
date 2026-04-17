import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { connectInstance, checkServer, updateWebhook } from "@/lib/stevo";

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
    const server = await checkServer();
    const instance = await connectInstance();

    return NextResponse.json({
      serverOk: server?.status === "ok",
      connected: instance?.message === "success",
      jid: instance?.data?.jid || null,
      phone: instance?.data?.jid?.split("@")[0] || null,
    });
  } catch {
    return NextResponse.json({ serverOk: false, connected: false });
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

  // Verify agent belongs to tenant
  const { data: agent } = await supabaseAdmin
    .from("agents")
    .select("id")
    .eq("id", agentId)
    .eq("tenant_id", tenantId)
    .single();

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Check Stevo connection
  const instance = await connectInstance();
  if (instance?.message !== "success") {
    return NextResponse.json({ error: "Stevo instance not connected" }, { status: 502 });
  }

  const phone = instance.data?.jid?.split("@")[0] || null;

  // Configure webhook to point to our endpoint
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/webhook/stevo`;
  await updateWebhook(webhookUrl);

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
        credentials: {
          provider: "stevo",
          instanceName: process.env.STEVO_INSTANCE_NAME,
          phone,
          webhookUrl,
        },
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
        credentials: {
          provider: "stevo",
          instanceName: process.env.STEVO_INSTANCE_NAME,
          phone,
          webhookUrl,
        },
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
  await updateWebhook("");

  return NextResponse.json({ disconnected: true });
}
