"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Loads persisted state from storage into the store once, after mount.
 * Rendering nothing keeps the server and first client render identical
 * (no hydration mismatch); the store swaps to stored data in an effect.
 */
export function StoreHydrator() {
  const hydrate = useAppStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return null;
}
