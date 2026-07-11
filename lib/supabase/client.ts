import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// These are inlined at build time. When absent, the app runs in local-only mode
// (localStorage) and no sign-in / sync UI is shown. Anon keys are public by
// design — security comes from Supabase Row Level Security + email auth.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let cached: SupabaseClient | null = null;

/** Returns a memoized browser Supabase client, or null if not configured. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (typeof window === "undefined") return null;
  if (!cached) {
    cached = createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return cached;
}

/** Where the magic-link email should send the user back to (respects basePath). */
export function authRedirectUrl(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${window.location.origin}${base}/`;
}
