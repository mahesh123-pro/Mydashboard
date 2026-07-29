"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

/**
 * Rehydrates the persisted store from localStorage after mount.
 * The store uses skipHydration:true so SSR and first client render both use
 * seed defaults (no hydration mismatch); persisted edits apply once mounted.
 * Once hydrated locally, it loads the latest state from MongoDB and sets up
 * automatic syncing.
 */
export function StoreHydrator() {
  useEffect(() => {
    let isHydratingOrLoading = true;
    let syncTimeout: NodeJS.Timeout;

    // 1. Rehydrate local storage first. This is synchronous and gives us a
    //    complete, usable state immediately — so the UI is unblocked right
    //    away rather than waiting on the network. The DB load below patches
    //    in fresher values when (and if) it arrives.
    useStore.persist.rehydrate();
    useStore.setState({ isLoading: false });

    // Safety net in case the request never settles at all.
    const fallbackTimeout = setTimeout(() => {
      isHydratingOrLoading = false;
    }, 10000);

    // 2. Fetch latest data from MongoDB
    async function loadFromDB() {
      try {
        const res = await fetch("/api/dashboard/load");
        const json = await res.json();
        if (json.success && json.data) {
          // Only apply keys the server actually has a value for. A partial or
          // freshly-seeded document would otherwise shallow-merge `undefined`
          // over the local arrays/objects and blank out the whole dashboard.
          const patch = Object.fromEntries(
            Object.entries(json.data).filter(([, v]) => v !== undefined && v !== null),
          );
          if (Object.keys(patch).length > 0) {
            useStore.setState(patch as Partial<ReturnType<typeof useStore.getState>>);
            toast.success("Sync complete: Loaded latest data from cloud database.");
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard from MongoDB:", err);
      } finally {
        isHydratingOrLoading = false;
        clearTimeout(fallbackTimeout);
      }
    }

    loadFromDB();

    // 3. Subscribe to store changes to push updates back to MongoDB (debounced)
    const unsubscribe = useStore.subscribe((state, prevState) => {
      if (isHydratingOrLoading) return;

      const syncableKeys = [
        "profile",
        "tasks",
        "meetings",
        "activity",
        "notes",
        "habits",
        "habitLog",
        "healthLog",
        "healthGoals",
        "meals",
        "supplements",
        "body",
        "workouts",
        "prs",
        "projects",
        "finance",
        "subscriptions",
        "savingsGoals",
        "transactions",
        "journal",
        "jobs",
        "settings",
      ] as const;

      // Only sync if actual syncable data changed, preventing loops from isSyncing/isLoading updates
      const hasChanged = syncableKeys.some((k) => state[k] !== prevState[k]);
      if (!hasChanged) return;

      const {
        profile,
        tasks,
        meetings,
        activity,
        notes,
        habits,
        habitLog,
        healthLog,
        healthGoals,
        meals,
        supplements,
        body,
        workouts,
        prs,
        projects,
        finance,
        subscriptions,
        savingsGoals,
        transactions,
        journal,
        jobs,
        settings,
      } = state;

      clearTimeout(syncTimeout);
      useStore.setState({ isSyncing: true });

      syncTimeout = setTimeout(async () => {
        try {
          const res = await fetch("/api/dashboard/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              profile,
              tasks,
              meetings,
              activity,
              notes,
              habits,
              habitLog,
              healthLog,
              healthGoals,
              meals,
              supplements,
              body,
              workouts,
              prs,
              projects,
              finance,
              subscriptions,
              savingsGoals,
              transactions,
              journal,
              jobs,
              settings,
            }),
          });
          const json = await res.json();
          if (json.success) {
            console.log("Dashboard synced to MongoDB successfully.");
          } else {
            console.error("Failed to sync to MongoDB:", json.error);
          }
        } catch (err) {
          console.error("Sync to MongoDB error:", err);
        } finally {
          useStore.setState({ isSyncing: false });
        }
      }, 3000); // 3-second debounce
    });

    return () => {
      unsubscribe();
      clearTimeout(syncTimeout);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return null;
}
