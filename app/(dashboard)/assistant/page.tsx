"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, CalendarRange, Dumbbell, Salad, BarChart3, Lightbulb } from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { useStore, todayHealth, habitCompletion } from "@/lib/store";
import type { AssistantContext } from "@/lib/assistant";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/layout/profile-chip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "ai"; text: string };

const PROMPTS = [
  { icon: CalendarRange, label: "Plan my week" },
  { icon: Dumbbell, label: "Today's workout" },
  { icon: Salad, label: "Diet suggestion" },
  { icon: BarChart3, label: "Analyze productivity" },
  { icon: Lightbulb, label: "Project ideas" },
];

export default function AssistantPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: `Good to see you, ${s.profile.name}. I'm your OS assistant — ask me to plan your week, review your training, or analyze your productivity. What's on your mind?` },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [source, setSource] = useState<"simulation" | "claude" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  if (!hydrated) return <Skeleton className="h-[70vh] rounded-3xl" />;

  const buildContext = (): AssistantContext => {
    const { done, total } = habitCompletion(s);
    const h = todayHealth(s);
    const upcoming = s.projects
      .filter((p) => p.status !== "shipped")
      .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline));
    return {
      name: s.profile.name,
      streak: s.profile.streak,
      tasksLeft: s.tasks.filter((t) => !t.done).length,
      tasksDone: s.tasks.filter((t) => t.done).length,
      tasksTotal: s.tasks.length,
      habitsDone: done,
      habitsTotal: total,
      water: h.water,
      waterGoal: s.healthGoals.water,
      calories: h.calories,
      protein: h.protein,
      proteinGoal: s.healthGoals.protein,
      caloriesBurned: h.caloriesBurned,
      urgentProject: upcoming[0]?.name,
      projects: upcoming.slice(0, 4).map((p) => ({ name: p.name, deadline: p.deadline, progress: p.progress, status: p.status })),
    };
  };

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const history = messages.map((m) => ({ role: m.role === "ai" ? ("assistant" as const) : ("user" as const), content: m.text }));
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, context: buildContext(), history }),
      });
      const data = await res.json();
      setSource(data.source ?? "simulation");
      setMessages((m) => [...m, { role: "ai", text: data.text ?? "Sorry, I couldn't respond just now." }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "I'm offline right now — check your connection and try again." }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Sparkles}
        title="AI Assistant"
        subtitle="Your context-aware second brain."
        accent="#059669"
        actions={
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px]",
              source === "claude"
                ? "border-success/40 bg-success/10 text-success"
                : "border-border bg-white/[0.03] text-muted-2",
            )}
          >
            <span className={cn("size-1.5 rounded-full", source === "claude" ? "bg-success" : "bg-muted-2")} />
            {source === "claude" ? "Live · Claude" : "Context-aware · local"}
          </span>
        }
      />

      <div className="glass flex h-[calc(100vh-15rem)] min-h-[520px] flex-col rounded-3xl">
        <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
            >
              {m.role === "ai" ? (
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Sparkles className="size-4 text-white" />
                </div>
              ) : (
                <Avatar name={s.profile.name} color={s.profile.avatarColor} size={32} />
              )}
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "ai" ? "border border-border bg-white/[0.03] text-foreground" : "bg-gradient-to-br from-primary to-secondary text-white",
                )}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Sparkles className="size-4 text-white" />
                </div>
                <div className="flex gap-1 rounded-2xl border border-border bg-white/[0.03] px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="size-1.5 rounded-full bg-muted"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
            {PROMPTS.map((p) => (
              <button
                key={p.label}
                onClick={() => send(p.label)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground hover:border-border-strong cursor-pointer"
              >
                <p.icon className="size-3.5" /> {p.label}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your assistant…"
              className="h-11 flex-1 rounded-xl border border-border bg-white/[0.03] px-4 text-sm outline-none focus:border-primary/50"
            />
            <button type="submit" className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white cursor-pointer">
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
