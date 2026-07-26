"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ListChecks, Dumbbell, FolderKanban, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Habits", href: "/habits", icon: ListChecks },
  { label: "Gym", href: "/gym", icon: Dumbbell },
  { label: "Projects", href: "/projects", icon: FolderKanban },
];

export function MobileNav() {
  const pathname = usePathname();
  const setCommandOpen = useStore((s) => s.setCommandOpen);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 lg:hidden">
      <nav className="glass-strong flex items-center gap-1 rounded-2xl p-1.5">
        {ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative grid size-12 place-items-center rounded-xl text-muted-2 transition-colors",
                active && "text-white",
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobile-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon className="relative z-10 size-5" />
            </Link>
          );
        })}
        <button
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
          className="grid size-12 place-items-center rounded-xl text-muted-2 transition-colors hover:text-foreground cursor-pointer"
        >
          <Search className="size-5" />
        </button>
      </nav>
    </div>
  );
}
