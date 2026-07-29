"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

/** Ticking clock. Returns a live Date, updated every `intervalMs`. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** True once mounted on the client — guards against SSR/localStorage mismatch. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Returns true once mounted on the client AND the store is fully loaded. */
export function usePageReady() {
  const hydrated = useHydrated();
  const isLoading = useStore((s) => s.isLoading);
  return hydrated && !isLoading;
}

/** Matches a media query, SSR-safe. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
