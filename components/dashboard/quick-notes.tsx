"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StickyNote, Plus, X, NotebookPen } from "lucide-react";
import { useStore } from "@/lib/store";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";

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
    <SectionCard
      fill
      scroll
      icon={StickyNote}
      iconColor="var(--color-warning)"
      title="Quick Notes"
      description={notes.length ? `${notes.length} saved` : "Scratchpad for loose thoughts"}
      bodyClassName="space-y-2"
      footer={
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="new-note" className="sr-only">
            New note
          </label>
          <input
            id="new-note"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Jot something down…"
            className="h-10 flex-1 rounded-field border border-border bg-surface px-3 text-sm outline-none placeholder:text-muted-2 focus:border-warning/50"
          />
          <button
            type="submit"
            aria-label="Add note"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-field bg-warning/20 text-warning"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </form>
      }
    >
      <>
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
              className="group flex items-start gap-2 rounded-field border border-border bg-surface p-3"
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
      </>
    </SectionCard>
  );
}
