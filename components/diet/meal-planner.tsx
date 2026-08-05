"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, Sunrise, Sun, Moon, Cookie, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { MealSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

const SLOTS: { slot: MealSlot; icon: LucideIcon; color: string }[] = [
  { slot: "Breakfast", icon: Sunrise, color: "#f59e0b" },
  { slot: "Lunch", icon: Sun, color: "#14b8a6" },
  { slot: "Dinner", icon: Moon, color: "#059669" },
  { slot: "Snacks", icon: Cookie, color: "#22c55e" },
];

export function MealPlanner() {
  const meals = useStore((s) => s.meals);
  const addMeal = useStore((s) => s.addMeal);
  const removeMeal = useStore((s) => s.removeMeal);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SLOTS.map(({ slot, icon: Icon, color }) => {
        const items = meals[slot];
        const kcal = items.reduce((a, m) => a + m.kcal, 0);
        return (
          <div key={slot} className="panel rounded-panel p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-field" style={{ background: `${color}1f`, color }}>
                  <Icon className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{slot}</div>
                  <div className="text-2xs text-muted-2 tabular">{kcal} kcal</div>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              <AnimatePresence initial={false}>
                {items.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="group flex items-center gap-2 rounded-field border border-border bg-surface px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{m.name}</div>
                      <div className="text-3xs text-muted-2 tabular">
                        {m.kcal} kcal · {m.protein}p · {m.carbs}c · {m.fat}f
                      </div>
                    </div>
                    <button
                      onClick={() => removeMeal(slot, m.id)}
                      className="text-muted-2 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <AddMeal
              color={color}
              onAdd={(item) => {
                addMeal(slot, item);
                toast.success(`Added to ${slot}`);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function AddMeal({
  color,
  onAdd,
}: {
  color: string;
  onAdd: (m: { name: string; kcal: number; protein: number; carbs: number; fat: number }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      kcal: Number(kcal) || 0,
      protein: Number(protein) || 0,
      carbs: 0,
      fat: 0,
    });
    setName("");
    setKcal("");
    setProtein("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-field border border-dashed border-border-strong py-2 text-xs text-muted-2 transition-colors hover:text-foreground cursor-pointer"
      >
        <Plus className="size-3.5" /> Add item
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Food name"
        className="h-9 w-full rounded-control border border-border bg-surface px-2.5 text-xs outline-none focus:border-primary/50"
      />
      <div className="flex gap-2">
        <input
          value={kcal}
          onChange={(e) => setKcal(e.target.value)}
          placeholder="kcal"
          inputMode="numeric"
          className="h-9 w-full rounded-control border border-border bg-surface px-2.5 text-xs outline-none focus:border-primary/50"
        />
        <input
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          placeholder="protein g"
          inputMode="numeric"
          className="h-9 w-full rounded-control border border-border bg-surface px-2.5 text-xs outline-none focus:border-primary/50"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className={cn("h-9 flex-1 rounded-control text-xs font-medium text-white cursor-pointer")}
          style={{ background: color }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-9 rounded-control border border-border px-3 text-xs text-muted-2 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
