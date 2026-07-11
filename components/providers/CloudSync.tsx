"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { SupabaseStorage, getStorage } from "@/lib/storage";
import { mergePersisted } from "@/lib/sync";
import { currentPersisted, useAppStore } from "@/store/useAppStore";
import { useSyncStore } from "@/store/useSyncStore";

/**
 * Keeps the local store and the user's Supabase row in sync while signed in:
 *   • on sign-in (and on tab re-focus) it pulls the cloud row, merges it with
 *     local by per-task timestamp, applies the result, and pushes it back;
 *   • every local edit is debounced and pushed to the cloud.
 * Renders nothing. No-op when Supabase isn't configured or the user is signed out.
 */
export function CloudSync() {
  const { status, userId } = useAuth();
  const hydrated = useAppStore((s) => s.hydrated);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressPush = useRef(false);

  useEffect(() => {
    if (!hydrated || status !== "signed_in" || !userId) return;
    const client = getSupabaseClient();
    if (!client) return;

    const cloud = new SupabaseStorage(client, userId);
    const local = getStorage();
    const { setStatus, markSynced } = useSyncStore.getState();
    let disposed = false;

    async function pullMergePush() {
      setStatus("syncing");
      try {
        const [localBlob, cloudBlob] = await Promise.all([
          local.load(),
          cloud.load(),
        ]);
        if (disposed) return;
        const merged = mergePersisted(localBlob, cloudBlob);
        if (merged) {
          suppressPush.current = true;
          useAppStore.getState().applySnapshot(merged);
          suppressPush.current = false;
          await cloud.save(merged);
        }
        if (!disposed) markSynced(new Date().toISOString());
      } catch (e) {
        if (!disposed) {
          setStatus("error", (e as Error)?.message ?? "Sync failed");
        }
      }
    }

    function schedulePush() {
      if (suppressPush.current) return;
      setStatus("syncing");
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(async () => {
        try {
          await cloud.save(currentPersisted());
          if (!disposed) markSynced(new Date().toISOString());
        } catch (e) {
          if (!disposed) {
            setStatus("error", (e as Error)?.message ?? "Sync failed");
          }
        }
      }, 800);
    }

    void pullMergePush();
    const unsubscribe = useAppStore.subscribe(schedulePush);

    function onVisible() {
      if (document.visibilityState === "visible") void pullMergePush();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      disposed = true;
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [hydrated, status, userId]);

  return null;
}
