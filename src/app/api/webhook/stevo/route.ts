import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";
import { sendText } from "@/lib/stevo";
import { chat } from "@/lib/ai";
import { createId } from "@paralleldrive/cuid2";

// POST /api/webhook/stevo — receives messages from Stevo/WhatsApp
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Log raw payload for debugging
    console.log("WEBHOOK RAW:", JSON.stringify(payload).slice(0, 2000));

    // Extract event type - Stevo v2 format
    const event = payload.event || payload.type || payload.Event || "";

    // Extract message data - try multiple formats
    const data = payload.data || payload.Data || payload;
    const info = data.Info || data.info || {};
    const message = data.Message || data.message || {};
    const msgContext = data.MessageContextInfo || {};

    // Try to get remote JID and text from different structures
    let remoteJid = "";
    let fromMe = false;
    let messageText = "";
    let pushName = "";

    // Stevo v2 format: Info.Chat, Info.IsFromMe, Message.conversation or Message.extendedTextMessage.text
    if (info.Chat) {
      remoteJid = info.Chat;
      fromMe = info.IsFromMe || false;
      pushName = info.PushName || data.PushName || "";
      messageText =
        message.conversation ||
        message.extendedTextMessage?.text ||
        "";
    }

    // Evolution API format: key.remoteJid, key.fromMe
    if (!remoteJid && data.key) {
      remoteJid = data.key.remoteJid || "";
      fromMe = data.key.fromMe || false;
      pushName = data.pushName || data.senderName || "";
      const msg = data.message || {};
      messageText =
        msg.conversation ||
        msg.extendedTextMessage?.text ||
        data.body ||
        data.text ||
        "";
    }

    // Fallback
    if (!remoteJid) {
      remoteJid = data.remoteJid || data.jid || "";
      messageText = data.body || data.text || data.content || "";
    }

    console.log("PARSED:", { event, remoteJid, fromMe, messageText: messageText?.slice(0, 100), pushName });

    // Ignore: no text, from me, groups, or non-message events
    if (!messageText || fromMe || !remoteJid || remoteJid.includes("@g.us")) {
      return NextResponse.json({
        status: "ignored",
        reason: !messageText ? "no_text" : fromMe ? "from_me" : !remoteJid ? "no_jid" : "group",
        event,
      });
    }

    const phone = remoteJid.split("@")[0];

    // Find active WhatsApp channel
    const { data: channel, error: channelError } = await supabaseAdmin
      .from("channels")
      .select("id, agent_id, type, active")
      .eq("type", "whatsapp")
      .eq("active", true)
      .limit(1)
      .single();

    if (channelError || !channel) {
      console.log("No active WhatsApp channel:", channelError?.message);
      return NextResponse.json({ error: "No active channel" }, { status: 404 });
    }

    // Fetch agent
    const { data: agent } = await supabaseAdmin
      .from("agents")
      .select("id, name, model, system_prompt, tenant_id")
      .eq("id", channel.agent_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Find or create contact
    let { data: contact } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .eq("phone", phone)
      .eq("tenant_id", agent.tenant_id)
      .single();

    if (!contact) {
      const { data: newContact } = await supabaseAdmin
        .from("contacts")
        .insert({
          id: createId(),
          tenant_id: agent.tenant_id,
          phone,
          name: pushName || null,
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
      .eq("agent_id", agent.id)
      .eq("contact_id", contact.id)
      .eq("channel_id", channel.id)
      .eq("status", "open")
      .single();

    if (!conversation) {
      const { data: newConv } = await supabaseAdmin
        .from("conversations")
        .insert({
          id: createId(),
          agent_id: agent.id,
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
      id: createId(),
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

    const systemMessage = agent.system_prompt ||
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
      agent.model || "gpt-4o-mini",
      chatMessages
    );

    console.log("AI REPLY:", reply.slice(0, 200));

    // Save assistant response
    await supabaseAdmin.from("messages").insert({
      id: createId(),
      conversation_id: conversation.id,
      role: "assistant",
      content: reply,
      tokens_used: tokensUsed,
    });

    // Send reply via Stevo WhatsApp
    const sendResult = await sendText(phone, reply);
    console.log("SEND RESULT:", JSON.stringify(sendResult).slice(0, 500));

    return NextResponse.json({ status: "ok", sent: true });
  } catch (err) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Internal error", detail: message }, { status: 500 });
  }
}
