import type { SupabaseClient } from "@supabase/supabase-js";
import type { PersistedState } from "./types";

/**
 * Persistence abstraction (build spec §9). All reads/writes go through this
 * interface so that swapping localStorage for Supabase later is a one-file
 * change with no UI impact.
 */
export interface AppStorage {
  load(): Promise<PersistedState | null>;
  save(state: PersistedState): Promise<void>;
}

export const STORAGE_KEY = "apollo-tracker-v1";

// Namespaced so this app can share a Supabase project with other apps.
export const CLOUD_TABLE = "apollo_app_state";

/** MVP implementation backed by the browser's localStorage. */
class LocalStorageAdapter implements AppStorage {
  async load(): Promise<PersistedState | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PersistedState;
    } catch {
      // Corrupt or unavailable storage — start fresh rather than crash.
      return null;
    }
  }

  async save(state: PersistedState): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota errors etc. are non-fatal for a single-user tracker.
    }
  }
}

/**
 * Cloud persistence backed by a single per-user row in Supabase. Used by the
 * sync engine when the user is signed in; the local adapter still runs
 * underneath for instant, offline-capable reads/writes.
 */
export class SupabaseStorage implements AppStorage {
  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string,
  ) {}

  async load(): Promise<PersistedState | null> {
    const { data, error } = await this.client
      .from(CLOUD_TABLE)
      .select("data")
      .eq("user_id", this.userId)
      .maybeSingle();
    if (error || !data) return null;
    return (data.data as PersistedState) ?? null;
  }

  async save(state: PersistedState): Promise<void> {
    await this.client.from(CLOUD_TABLE).upsert(
      {
        user_id: this.userId,
        data: state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  }
}

/** Local persistence (always available). Cloud sync is layered on top. */
export function getStorage(): AppStorage {
  return new LocalStorageAdapter();
}
