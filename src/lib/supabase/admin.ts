// ============================================================
// ClarityPulse — Supabase Admin Client (Service Role)
//
// Used by server-side endpoints that need to bypass RLS,
// such as the /api/track event collection endpoint.
//
// IMPORTANT: Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
// This module should only be imported in server-side code.
// ============================================================

import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create a Supabase client using the service_role key.
 * This client bypasses Row Level Security (RLS) and should only
 * be used for trusted server-side operations like event ingestion.
 */
export function getAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    );
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  });

  return adminClient;
}
