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

// Swap this factory to return a SupabaseStorage instance later.
export function getStorage(): AppStorage {
  return new LocalStorageAdapter();
}
