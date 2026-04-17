import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/db";

function generateId() {
  return "c" + randomBytes(12).toString("base64url").toLowerCase().slice(0, 24);
}

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email || !name) {
      return NextResponse.json(
        { error: "Campos obrigatórios: userId, email, name" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ ok: true });
    }

    // Create tenant
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .insert({
        id: generateId(),
        name,
        slug: `${slug}-${userId.slice(0, 8)}`,
        plan: "starter",
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    // Create user
    const { error: userError } = await supabaseAdmin.from("users").insert({
      id: userId,
      tenant_id: tenant.id,
      email,
      role: "owner",
    });

    if (userError) throw userError;

    return NextResponse.json({ ok: true, tenantId: tenant.id });
  } catch (err: unknown) {
    console.error("Auth setup error:", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
