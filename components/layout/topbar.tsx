"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { NAV } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { ProfileChip } from "./profile-chip";

export function Topbar() {
  const pathname = usePathname();
  const setCommandOpen = useStore((s) => s.setCommandOpen);
  const current =
    NAV.find((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href))) ?? NAV[0];

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-2 px-4 pt-3 sm:-mx-6 sm:px-6">
      <div className="glass flex h-14 items-center gap-3 rounded-2xl px-3 sm:px-4">
        {/* mobile brand */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="size-4 text-white" />
          </div>
        </div>

        <div className="hidden min-w-0 items-center gap-2 lg:flex">
          <current.icon className="size-4 text-muted-2" />
          <span className="truncate text-sm font-medium text-muted">{current.label}</span>
        </div>

        {/* search trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="group ml-auto flex h-9 items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-muted-2 transition-colors hover:border-border-strong hover:text-muted sm:ml-0 sm:mr-auto sm:w-72"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Search everything…</span>
          <kbd className="ml-auto hidden items-center gap-0.5 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-2 sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        <button
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-xl border border-border bg-white/[0.03] text-muted transition-colors hover:text-foreground hover:bg-white/[0.07] cursor-pointer"
        >
          <Bell className="size-4" />
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
