"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Mirrors appearance settings onto <html> as data-attributes so the stylesheet
 * can react to them. Kept purely CSS-driven (see globals.css) — this component
 * only reflects state → DOM, it never sets inline styles. Runs after mount and
 * re-runs whenever the relevant settings change (including after the persisted
 * store rehydrates), so toggles in Settings take effect live.
 */
export function SettingsEffect() {
  const fontSize = useStore((s) => s.settings?.fontSize ?? "default");
  const density = useStore((s) => s.settings?.layoutDensity ?? "comfortable");
  const glass = useStore((s) => s.settings?.glassIntensity ?? "medium");

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.fontSize = fontSize;
    el.dataset.density = density;
    el.dataset.glass = glass;
  }, [fontSize, density, glass]);

  return null;
}
