import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/db";

// Temporary debug endpoint - logs raw webhook payload to database
export async function POST(request: Request) {
  const payload = await request.json();

  // Store raw payload in a simple way
  try {
    await supabaseAdmin.from("messages").insert({
      id: "debug_" + Date.now(),
      conversation_id: "debug",
      role: "system",
      content: JSON.stringify(payload).slice(0, 10000),
    });
  } catch {
    // ignore
  }

  return NextResponse.json({ logged: true, keys: Object.keys(payload) });
}
