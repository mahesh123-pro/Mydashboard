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

    // 1. Rehydrate local storage first
    useStore.persist.rehydrate();

    // Set a max load timeout of 6 seconds to avoid blocking the page indefinitely if MongoDB is slow/offline
    const fallbackTimeout = setTimeout(() => {
      if (isHydratingOrLoading) {
        console.warn("MongoDB load connection timed out. Falling back to local storage.");
        useStore.setState({ isLoading: false });
        isHydratingOrLoading = false;
      }
    }, 6000);

    // 2. Fetch latest data from MongoDB
    async function loadFromDB() {
      try {
        const res = await fetch("/api/dashboard/load");
        const json = await res.json();
        if (json.success && json.data) {
          // Update the store with the latest MongoDB data, and mark loading complete
          useStore.setState({ ...json.data, isLoading: false });
          toast.success("Sync complete: Loaded latest data from cloud database.");
        } else {
          useStore.setState({ isLoading: false });
        }
      } catch (err) {
        console.error("Failed to load dashboard from MongoDB:", err);
        useStore.setState({ isLoading: false });
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
