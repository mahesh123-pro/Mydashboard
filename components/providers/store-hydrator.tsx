"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Rehydrates the persisted store from localStorage after mount.
 * The store uses skipHydration:true so SSR and first client render both use
 * seed defaults (no hydration mismatch); persisted edits apply once mounted.
 */
export function StoreHydrator() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);
  return null;
}
