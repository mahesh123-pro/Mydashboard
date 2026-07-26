"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Check, Plus, ListTodo, GripVertical, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { PriorityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TasksToday() {
  const tasks = useStore((s) => s.tasks);
  const reorderTasks = useStore((s) => s.reorderTasks);
  const addTask = useStore((s) => s.addTask);
  const [value, setValue] = useState("");

  const done = tasks.filter((t) => t.done).length;
  const allDone = tasks.length > 0 && done === tasks.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    addTask({ title: value.trim(), category: "Inbox", priority: "medium" });
    toast.success("Task added");
    setValue("");
  };

  return (
    <div className="glass flex h-full flex-col rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
          <ListTodo className="size-4 text-primary" /> Tasks Due Today
        </h3>
        <span className="text-[11px] text-muted-2 tabular">
          {done}/{tasks.length} done
        </span>
      </div>

      <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <EmptyState icon={PartyPopper} title="Inbox zero" description="No tasks yet. Add one below to get going." compact />
        ) : allDone ? (
          <EmptyState icon={PartyPopper} title="All done for today!" description="Every task complete. Enjoy the win." compact />
        ) : null}

        <Reorder.Group axis="y" values={tasks} onReorder={(v) => reorderTasks(v.map((t) => t.id))} className="space-y-1.5">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </Reorder.Group>
      </div>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a task…"
          className="h-10 flex-1 rounded-xl border border-border bg-white/[0.03] px-3 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-primary/50"
        />
        <button type="submit" aria-label="Add task" className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white cursor-pointer">
          <Plus className="size-4" />
        </button>
      </form>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const toggleTask = useStore((s) => s.toggleTask);
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      className="group flex items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.04]"
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-muted-2 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <button onClick={() => toggleTask(task.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer">
        <span
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
            task.done ? "border-success bg-success text-white" : "border-border-strong text-transparent group-hover:border-primary",
          )}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <span className={cn("min-w-0 flex-1 truncate text-sm", task.done && "text-muted-2 line-through")}>
          {task.title}
        </span>
        {task.time && <span className="tabular text-[11px] text-muted-2">{task.time}</span>}
        {!task.done && <PriorityBadge priority={task.priority} />}
      </button>
    </Reorder.Item>
  );
}
