"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { KeyboardShortcuts } from "@/components/layout/keyboard-shortcuts";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useStore((s) => s.sidebarCollapsed);
  const animatedBg = useStore((s) => s.settings?.animatedBackground ?? true);

  return (
    <div className="relative min-h-screen">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-[200] rounded-field bg-primary px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      {animatedBg && <AnimatedBackground />}
      <Sidebar />
      <CommandPalette />
      <KeyboardShortcuts />
      <MobileNav />

      <div className={cn("transition-[padding] duration-300 ease-out", collapsed ? "lg:pl-[96px]" : "lg:pl-[280px]")}>
        <div className="mx-auto max-w-[1440px] px-4 pb-28 sm:px-6 lg:pb-12">
          <Topbar />
          <AnimatePresence mode="wait">
            <motion.main
              id="main-content"
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.12, ease: "easeIn" } }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
