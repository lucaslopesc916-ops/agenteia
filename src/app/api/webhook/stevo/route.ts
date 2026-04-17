import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { sendText } from "@/lib/stevo";
import { chat } from "@/lib/ai";

// POST /api/webhook/stevo — receives messages from Stevo/WhatsApp
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Stevo sends different event types — we only care about incoming messages
    const event = payload.event || payload.type;
    if (event !== "MESSAGE" && event !== "messages.upsert") {
      return NextResponse.json({ status: "ignored" });
    }

    const messageData = payload.data || payload;
    const remoteJid = messageData.key?.remoteJid || messageData.remoteJid;
    const fromMe = messageData.key?.fromMe ?? false;
    const messageText =
      messageData.message?.conversation ||
      messageData.message?.extendedTextMessage?.text ||
      messageData.body ||
      messageData.text;

    // Ignore messages sent by us or without text
    if (fromMe || !messageText || !remoteJid) {
      return NextResponse.json({ status: "ignored" });
    }

    // Extract phone number from JID (e.g. "5534999999999@s.whatsapp.net" → "5534999999999")
    const phone = remoteJid.split("@")[0];

    // Ignore group messages
    if (remoteJid.includes("@g.us")) {
      return NextResponse.json({ status: "ignored_group" });
    }

    // Find active WhatsApp channel linked to an agent
    const { data: channel } = await supabaseAdmin
      .from("channels")
      .select("*, agents!inner(*)")
      .eq("type", "whatsapp")
      .eq("active", true)
      .limit(1)
      .single();

    if (!channel) {
      console.log("No active WhatsApp channel found");
      return NextResponse.json({ status: "no_channel" });
    }

    const agent = (channel as Record<string, unknown>).agents as Record<string, unknown>;

    // Find or create contact
    let { data: contact } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .eq("phone", phone)
      .eq("tenant_id", agent.tenant_id as string)
      .single();

    if (!contact) {
      const pushName = messageData.pushName || messageData.senderName || null;
      const { data: newContact } = await supabaseAdmin
        .from("contacts")
        .insert({
          tenant_id: agent.tenant_id as string,
          phone,
          name: pushName,
          source: "whatsapp",
        })
        .select()
        .single();
      contact = newContact;
    }

    if (!contact) {
      return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
    }

    // Find or create conversation
    let { data: conversation } = await supabaseAdmin
      .from("conversations")
      .select("*")
      .eq("agent_id", agent.id as string)
      .eq("contact_id", contact.id)
      .eq("channel_id", channel.id)
      .eq("status", "open")
      .single();

    if (!conversation) {
      const { data: newConv } = await supabaseAdmin
        .from("conversations")
        .insert({
          agent_id: agent.id as string,
          contact_id: contact.id,
          channel_id: channel.id,
          status: "open",
        })
        .select()
        .single();
      conversation = newConv;
    }

    if (!conversation) {
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }

    // Save incoming message
    await supabaseAdmin.from("messages").insert({
      conversation_id: conversation.id,
      role: "user",
      content: messageText,
    });

    // Load conversation history (last 20 messages)
    const { data: history } = await supabaseAdmin
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true })
      .limit(20);

    const systemMessage = (agent.system_prompt as string) ||
      `Você é ${agent.name}, um assistente de atendimento ao cliente. Seja educado, profissional e objetivo.`;

    const chatMessages = [
      { role: "system" as const, content: systemMessage },
      ...(history || []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content as string,
      })),
    ];

    // Generate AI response
    const { reply, tokensUsed } = await chat(
      (agent.model as string) || "gpt-4o-mini",
      chatMessages
    );

    // Save assistant response
    await supabaseAdmin.from("messages").insert({
      conversation_id: conversation.id,
      role: "assistant",
      content: reply,
      tokens_used: tokensUsed,
    });

    // Send reply via Stevo WhatsApp
    await sendText(phone, reply);

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
