"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function PWA() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Register the service worker only in production so it never interferes with dev HMR.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <AnimatePresence>
      {deferred && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="glass-strong fixed bottom-24 left-4 z-40 flex items-center gap-3 rounded-2xl p-2 pl-3 lg:bottom-6 lg:left-[300px]"
        >
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Download className="size-4 text-white" />
          </div>
          <div className="text-xs">
            <div className="font-semibold">Install Mahesh OS</div>
            <div className="text-muted-2">Add to your home screen</div>
          </div>
          <button
            onClick={install}
            className="ml-1 rounded-lg bg-gradient-to-br from-primary to-secondary px-3 py-1.5 text-xs font-medium text-white cursor-pointer"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="grid size-7 place-items-center rounded-lg text-muted-2 transition-colors hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
