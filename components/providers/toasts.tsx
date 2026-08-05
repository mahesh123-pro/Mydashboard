"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/**
 * The Toaster was mounted with a hardcoded `theme="dark"`, so toasts stayed
 * dark-on-dark after switching to the light theme. It has to read the resolved
 * theme, which means it has to be a client component.
 */
export function Toasts() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme === "light" ? "light" : "dark"}
      offset={16}
      toastOptions={{
        style: {
          background: "var(--glass-strong)",
          border: "1px solid var(--border-strong)",
          color: "var(--foreground)",
          backdropFilter: "blur(20px)",
        },
      }}
    />
  );
}
