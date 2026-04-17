import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/db";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: dbUser } = await supabaseAdmin
    .from("users")
    .select("*, tenants(*)")
    .eq("id", user.id)
    .single();

  return dbUser;
}
