"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Cloud, CloudOff, Loader2, Search, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { NAV } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { ProfileChip } from "./profile-chip";
import { useHydrated } from "@/lib/hooks";

export function Topbar() {
  const pathname = usePathname();
  const setCommandOpen = useStore((s) => s.setCommandOpen);
  const isSyncing = useStore((s) => s.isSyncing);
  const hydrated = useHydrated();

  const current =
    NAV.find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href))) ?? NAV[0];
  const atRoot = current.href === "/";

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-4 px-4 pt-3 sm:-mx-6 sm:px-6">
      <div className="glass flex h-14 items-center gap-3 rounded-tile px-3 sm:px-4">
        {/* mobile brand */}
        <Link href="/" aria-label="Mahesh OS home" className="flex items-center gap-2 lg:hidden">
          <div className="grid size-8 place-items-center rounded-control bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="size-4 text-white" aria-hidden />
          </div>
        </Link>

        {/* Breadcrumbs — replaces the single flat page label, so the group a
            page belongs to is visible and Dashboard is always one click away. */}
        <nav aria-label="Breadcrumb" className="hidden min-w-0 lg:block">
          <ol className="flex items-center gap-1.5 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-2 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </li>
            {!atRoot && (
              <>
                <ChevronRight className="size-3.5 shrink-0 text-muted-2" aria-hidden />
                <li className="text-muted-2">{current.group}</li>
                <ChevronRight className="size-3.5 shrink-0 text-muted-2" aria-hidden />
                <li className="flex min-w-0 items-center gap-1.5">
                  <current.icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <span aria-current="page" className="truncate font-medium">
                    {current.label}
                  </span>
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* search trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="ml-auto flex h-9 cursor-pointer items-center gap-2 rounded-field border border-border bg-surface px-3 text-sm text-muted-2 transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-muted sm:w-64"
        >
          <Search className="size-4" aria-hidden />
          <span className="hidden sm:inline">Search everything…</span>
          <kbd className="ml-auto hidden items-center gap-0.5 rounded-control border border-border px-1.5 py-0.5 font-mono text-3xs text-muted-2 sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        {/* Cloud sync state. The store has tracked `isSyncing` since the Mongo
            migration but never showed it, so saves were invisible. */}
        {hydrated && <SyncIndicator syncing={isSyncing} />}

        <button
          aria-label="Notifications"
          className="relative grid size-9 cursor-pointer place-items-center rounded-field border border-border bg-surface text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
        </button>

        <ThemeToggle />

        <div className="hidden sm:block">
          <ProfileChip compact />
        </div>
      </div>
    </header>
  );
}

function SyncIndicator({ syncing }: { syncing: boolean }) {
  const online = typeof navigator === "undefined" ? true : navigator.onLine;
  const Icon = !online ? CloudOff : syncing ? Loader2 : Cloud;
  const text = !online ? "Offline — changes saved locally" : syncing ? "Saving…" : "All changes saved";

  return (
    <span
      role="status"
      aria-live="polite"
      title={text}
      className="hidden size-9 place-items-center rounded-field text-muted-2 md:grid"
    >
      <Icon
        className={`size-4 ${syncing ? "animate-spin text-primary" : !online ? "text-warning" : ""}`}
        aria-hidden
      />
      <span className="sr-only">{text}</span>
    </span>
  );
}
