"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, ListChecks, FolderKanban, MoreHorizontal, X } from "lucide-react";
import { NAV, NAV_GROUPS } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Habits", href: "/habits", icon: ListChecks },
  { label: "Projects", href: "/projects", icon: FolderKanban },
];

export function MobileNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const setCommandOpen = useStore((s) => s.setCommandOpen);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Lock body scroll while the sheet is up. (Closing on navigation is handled
  // by the links themselves rather than a pathname effect — setting state
  // synchronously in an effect body triggers a cascading render.)
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  // Anything not on the bar is only reachable through the sheet — previously
  // 15 of 19 pages had no touch path at all (⌘K needs a hardware keyboard).
  const inSheet = NAV.filter((n) => !PRIMARY.some((p) => p.href === n.href));

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 lg:hidden">
        <nav aria-label="Primary" className="glass-strong flex items-center gap-1 rounded-tile p-1.5">
          {PRIMARY.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative grid size-12 place-items-center rounded-field transition-colors",
                  active ? "text-white" : "text-muted-2",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-active"
                    className="absolute inset-0 rounded-field bg-gradient-to-br from-primary to-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="relative z-10 size-5" aria-hidden />
              </Link>
            );
          })}

          <button
            onClick={() => setSheetOpen(true)}
            aria-label="All sections"
            aria-expanded={sheetOpen}
            className={cn(
              "grid size-12 cursor-pointer place-items-center rounded-field transition-colors",
              inSheet.some((n) => isActive(n.href)) ? "text-primary" : "text-muted-2",
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="All sections"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="glass-strong fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-panel pb-8 lg:hidden"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between bg-inherit px-5 pb-3 pt-4">
                <div>
                  <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border-strong" aria-hidden />
                  <h2 className="text-sm font-semibold">All sections</h2>
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className="grid size-9 cursor-pointer place-items-center rounded-field border border-border bg-surface text-muted"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>

              <div className="space-y-4 px-5">
                <button
                  onClick={() => {
                    setSheetOpen(false);
                    setCommandOpen(true);
                  }}
                  className="w-full cursor-pointer rounded-field border border-border bg-surface px-4 py-3 text-left text-sm text-muted transition-colors hover:bg-surface-hover"
                >
                  Search everything…
                </button>

                {NAV_GROUPS.map((group) => {
                  const items = inSheet.filter((n) => n.group === group);
                  if (!items.length) return null;
                  return (
                    <div key={group}>
                      <div className="pb-2 text-3xs font-semibold uppercase tracking-[0.14em] text-muted-2">
                        {group}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((item) => {
                          const active = isActive(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setSheetOpen(false)}
                              aria-current={active ? "page" : undefined}
                              className={cn(
                                "flex items-center gap-2.5 rounded-field border px-3 py-2.5 text-sm transition-colors",
                                active
                                  ? "border-primary/25 bg-primary/[0.12] text-foreground"
                                  : "border-border bg-surface text-muted",
                              )}
                            >
                              <item.icon
                                className={cn("size-4 shrink-0", active && "text-primary")}
                                aria-hidden
                              />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
