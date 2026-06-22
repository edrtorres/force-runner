import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

export function createSupabaseServiceClient() {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

export type SupabaseServiceClient = ReturnType<typeof createSupabaseServiceClient>;
