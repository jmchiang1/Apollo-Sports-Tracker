"use client";

import { create } from "zustand";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: string | null;
  error: string | null;
  setStatus: (status: SyncStatus, error?: string | null) => void;
  markSynced: (at: string) => void;
}

/** Tiny store the cloud sync engine writes to and the account UI reads from. */
export const useSyncStore = create<SyncState>((set) => ({
  status: "idle",
  lastSyncedAt: null,
  error: null,
  setStatus: (status, error = null) => set({ status, error }),
  markSynced: (at) => set({ status: "synced", lastSyncedAt: at, error: null }),
}));
