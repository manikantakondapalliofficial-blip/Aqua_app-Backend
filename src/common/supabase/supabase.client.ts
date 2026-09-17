import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton Supabase client — import this in every service that needs DB access.
// Services use this directly; controllers NEVER import this.
let client: SupabaseClient;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // service-role key — backend only
    );
  }
  return client;
}
