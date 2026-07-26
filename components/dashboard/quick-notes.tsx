"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StickyNote, Plus, X, NotebookPen } from "lucide-react";
import { useStore } from "@/lib/store";
import { EmptyState } from "@/components/ui/empty-state";

export function QuickNotes() {
  const notes = useStore((s) => s.notes);
  const addNote = useStore((s) => s.addNote);
  const removeNote = useStore((s) => s.removeNote);
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    addNote(value.trim());
    setValue("");
  };

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-6">
      <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
        <StickyNote className="size-4 text-warning" /> Quick Notes
      </h3>
      <div className="no-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto">
        {notes.length === 0 && (
          <EmptyState icon={NotebookPen} title="No notes yet" description="Capture a fleeting thought below." compact />
        )}
        <AnimatePresence initial={false}>
          {notes.map((n, i) => (
            <motion.div
              key={n + i}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="group flex items-start gap-2 rounded-xl border border-border bg-white/[0.02] p-3"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
              <span className="min-w-0 flex-1 text-sm text-muted">{n}</span>
              <button
                onClick={() => removeNote(i)}
                className="text-muted-2 opacity-0 transition-opacity hover:text-danger group-hover:opacity-100 cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Jot something down…"
          className="h-10 flex-1 rounded-xl border border-border bg-white/[0.03] px-3 text-sm outline-none placeholder:text-muted-2 focus:border-warning/50"
        />
        <button type="submit" className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning/20 text-warning cursor-pointer">
          <Plus className="size-4" />
        </button>
      </form>
    </div>
  );
}
