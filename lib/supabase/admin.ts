import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

/**
 * Supabase admin klient (Service Role) – pouze na serveru.
 * Nikdy nepoužívat v client components / browser bundle.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;

  // Používáme stejnou URL jako pro public client (jen server-side key je jiný).
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url) {
    throw new Error("Missing env NEXT_PUBLIC_SUPABASE_URL (required for Supabase admin client).");
  }
  if (!serviceRoleKey) {
    throw new Error("Missing env SUPABASE_SERVICE_ROLE_KEY (server-only).");
  }

  cachedAdminClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "vizualio-web/server" } }
  });

  return cachedAdminClient;
}

