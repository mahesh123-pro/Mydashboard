"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";
import { NAV, NAV_GROUPS } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { ProfileChip, Avatar } from "./profile-chip";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useStore((s) => s.sidebarCollapsed);
  const setCollapsed = useStore((s) => s.setSidebarCollapsed);
  const name = useStore((s) => s.profile.name);
  const color = useStore((s) => s.profile.avatarColor);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // The nav list is taller than the panel on laptop screens, so the current
  // page can sit below the fold — reachable via ⌘K but with no visible active
  // state, which reads as "that page doesn't exist". Pull it into view.
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const active = navRef.current?.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ block: "nearest" });
  }, [pathname, collapsed]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 268 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      aria-label="Primary navigation"
      className="fixed inset-y-0 left-0 z-40 hidden p-3 lg:block"
    >
      <div className="glass flex h-full flex-col rounded-3xl p-3">
        {/* brand */}
        <div className={cn("flex items-center gap-2.5 px-1.5 py-2", collapsed && "justify-center")}>
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-[0_6px_18px_-6px_rgba(99,102,241,0.8)]">
            <Sparkles className="size-5 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Mahesh OS</div>
              <div className="text-[10px] text-muted-2">Personal Operating System</div>
            </div>
          )}
        </div>

        {/* nav */}
        <nav ref={navRef} className="nav-scroll mt-2 flex-1 space-y-2.5 overflow-y-auto pr-1.5">
          {NAV_GROUPS.map((group) => {
            const items = NAV.filter((n) => n.group === group);
            return (
              <div key={group}>
                {!collapsed && (
                  <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-2">
                    {group}
                  </div>
                )}
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        data-active={active}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-2.5 py-1.5 text-sm transition-colors",
                          collapsed && "justify-center",
                          active ? "text-foreground" : "text-muted hover:text-foreground",
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-xl bg-primary/[0.12] ring-1 ring-inset ring-primary/20"
                            transition={{ type: "spring", stiffness: 400, damping: 34 }}
                          >
                            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                          </motion.span>
                        )}
                        <item.icon className={cn("relative z-10 size-[18px] shrink-0", active ? "text-primary" : "text-muted-2 group-hover:text-foreground")} />
                        {!collapsed && <span className="relative z-10 truncate font-medium">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="mt-2 space-y-2">
          {collapsed ? (
            <div className="flex justify-center">
              <Avatar name={name} url={useStore((s) => s.profile.avatarUrl)} color={color} size={36} />
            </div>
          ) : (
            <ProfileChip />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-muted-2 transition-colors hover:bg-white/[0.05] hover:text-foreground cursor-pointer",
              collapsed && "justify-center",
            )}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
