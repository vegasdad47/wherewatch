import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabaseAdmin() {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return client;
}

export type UserTier = "free" | "premium";

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  password_hash?: string | null;
  tier: UserTier;
  stripe_customer_id?: string | null;
}
