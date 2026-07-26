"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Smile, Meh, Frown, Laugh, PenLine } from "lucide-react";
import { toast } from "sonner";
import { useHydrated } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import type { JournalEntry } from "@/lib/types";
import { dayKey, cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const MOODS: { key: JournalEntry["mood"]; icon: typeof Smile; color: string; label: string }[] = [
  { key: "great", icon: Laugh, color: "#22c55e", label: "Great" },
  { key: "good", icon: Smile, color: "#14b8a6", label: "Good" },
  { key: "ok", icon: Meh, color: "#f59e0b", label: "Okay" },
  { key: "low", icon: Frown, color: "#ef4444", label: "Low" },
];

export default function JournalPage() {
  const hydrated = useHydrated();
  const journal = useStore((s) => s.journal);
  const addJournal = useStore((s) => s.addJournal);
  const [mood, setMood] = useState<JournalEntry["mood"]>("good");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;
    addJournal({ date: dayKey(), mood, title: title.trim() || "Untitled", body: body.trim() });
    setTitle("");
    setBody("");
    toast.success("Journal entry saved");
  };

  return (
    <div className="space-y-5">
      <PageHeader icon={BookOpen} title="Journal" subtitle="Reflect, record, grow." accent="#059669" />

      <div className="grid gap-4 lg:grid-cols-5">
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <PenLine className="size-4 text-secondary" /> New Entry
          </h3>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(m.key)}
                  className={cn(
                    "grid flex-1 place-items-center gap-1 rounded-xl border py-2.5 transition-colors",
                    mood === m.key ? "border-transparent" : "border-border text-muted-2 hover:text-foreground",
                  )}
                  style={mood === m.key ? { background: `${m.color}1f`, color: m.color, boxShadow: `inset 0 0 0 1px ${m.color}44` } : undefined}
                >
                  <m.icon className="size-5" />
                  <span className="text-[10px]">{m.label}</span>
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="h-10 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm outline-none focus:border-primary/50"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="w-full resize-none rounded-xl border border-border bg-white/[0.03] p-3 text-sm outline-none focus:border-primary/50"
            />
            <Button type="submit" className="w-full">
              Save entry
            </Button>
          </form>
        </GlassCard>

        <div className="space-y-3 lg:col-span-3">
          {journal.length === 0 && (
            <GlassCard className="p-6">
              <EmptyState icon={BookOpen} title="Your journal is empty" description="Write your first entry — even one line counts." />
            </GlassCard>
          )}
          <AnimatePresence initial={false}>
            {journal.map((e) => {
              const m = MOODS.find((x) => x.key === e.mood)!;
              return (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="grid size-9 place-items-center rounded-xl" style={{ background: `${m.color}1f`, color: m.color }}>
                          <m.icon className="size-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{e.title}</div>
                          <div className="text-[11px] text-muted-2">
                            {new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </div>
                        </div>
                      </div>
                    </div>
                    {e.body && <p className="mt-3 text-sm leading-relaxed text-muted">{e.body}</p>}
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
