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

    // 2. Fetch latest data from MongoDB
    async function loadFromDB() {
      try {
        const res = await fetch("/api/dashboard/load");
        const json = await res.json();
        if (json.success && json.data && json.data.profile) {
          // Update the store with the latest MongoDB data
          useStore.setState(json.data);
          toast.success("Sync complete: Loaded latest data from cloud database.");
        }
      } catch (err) {
        console.error("Failed to load dashboard from MongoDB:", err);
      } finally {
        isHydratingOrLoading = false;
      }
    }

    loadFromDB();

    // 3. Subscribe to store changes to push updates back to MongoDB (debounced)
    const unsubscribe = useStore.subscribe((state) => {
      if (isHydratingOrLoading) return;

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
        }
      }, 3000); // 3-second debounce
    });

    return () => {
      unsubscribe();
      clearTimeout(syncTimeout);
    };
  }, []);

  return null;
}
