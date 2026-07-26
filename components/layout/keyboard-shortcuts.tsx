"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { GO_CHORDS, SHORTCUT_GROUPS } from "@/lib/shortcuts";

function isTypingTarget(el: EventTarget | null) {
  const t = el as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const setCommandOpen = useStore((s) => s.setCommandOpen);
  const setSidebarCollapsed = useStore((s) => s.setSidebarCollapsed);

  const [help, setHelp] = useState(false);
  const [pendingG, setPendingG] = useState(false);
  const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearG = useCallback(() => {
    setPendingG(false);
    if (gTimer.current) clearTimeout(gTimer.current);
  }, []);

  useEffect(() => {
    const onOpenHelp = () => setHelp(true);
    window.addEventListener("open-shortcuts", onOpenHelp);
    return () => window.removeEventListener("open-shortcuts", onOpenHelp);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHelp(false);
        clearG();
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return; // ⌘K handled by palette

      const key = e.key.toLowerCase();

      // resolve a pending `g` chord
      if (pendingG) {
        const dest = GO_CHORDS[key];
        clearG();
        if (dest) {
          e.preventDefault();
          router.push(dest.href);
        }
        return;
      }

      if (key === "g") {
        e.preventDefault();
        setPendingG(true);
        if (gTimer.current) clearTimeout(gTimer.current);
        gTimer.current = setTimeout(() => setPendingG(false), 1300);
        return;
      }

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          setCommandOpen(true);
          break;
        case "t":
        case "T":
          e.preventDefault();
          setTheme(theme === "light" ? "dark" : "light");
          break;
        case "\\":
          e.preventDefault();
          setSidebarCollapsed(!useStore.getState().sidebarCollapsed);
          break;
        case "?":
          e.preventDefault();
          setHelp((v) => !v);
          break;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pendingG, theme, router, setTheme, setCommandOpen, setSidebarCollapsed, clearG]);

  return (
    <>
      {/* chord hint */}
      <AnimatePresence>
        {pendingG && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-strong fixed bottom-24 left-1/2 z-[90] -translate-x-1/2 rounded-xl px-3 py-2 text-xs text-muted lg:bottom-6"
          >
            <span className="font-mono text-foreground">g</span> then a key… (d, h, w, p, f, j, s)
          </motion.div>
        )}
      </AnimatePresence>

      {/* help overlay */}
      <AnimatePresence>
        {help && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setHelp(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="glass-strong relative w-full max-w-2xl overflow-hidden rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 text-base font-semibold">
                  <Keyboard className="size-5 text-primary" /> Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setHelp(false)}
                  className="grid size-8 place-items-center rounded-lg text-muted-2 transition-colors hover:bg-white/[0.06] hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {SHORTCUT_GROUPS.map((group) => (
                  <div key={group.title}>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-2">
                      {group.title}
                    </div>
                    <div className="space-y-1.5">
                      {group.rows.map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-muted">{row.label}</span>
                          <span className="flex shrink-0 items-center gap-1">
                            {row.keys.map((k, i) => (
                              <kbd
                                key={i}
                                className="grid h-6 min-w-6 place-items-center rounded-md border border-border bg-white/[0.04] px-1.5 font-mono text-[11px] text-foreground"
                              >
                                {k}
                              </kbd>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
