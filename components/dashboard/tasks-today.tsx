"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Check, Plus, ListTodo, GripVertical, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { PriorityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionCard } from "@/components/ui/section-card";
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
    <SectionCard
      fill
      scroll
      icon={ListTodo}
      iconColor="var(--color-primary)"
      title="Tasks Due Today"
      description={tasks.length ? `${tasks.length - done} remaining` : "Nothing scheduled"}
      action={
        <span className="tabular text-2xs text-muted-2">
          {done}/{tasks.length} done
        </span>
      }
      bodyClassName="pr-1"
      footer={
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="new-task" className="sr-only">
            New task
          </label>
          <input
            id="new-task"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add a task…"
            className="h-10 flex-1 rounded-field border border-border bg-surface px-3 text-sm outline-none transition-colors placeholder:text-muted-2 focus:border-primary/50"
          />
          <button
            type="submit"
            aria-label="Add task"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-field bg-gradient-to-br from-primary to-secondary text-white"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </form>
      }
    >
      <>
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
      </>
    </SectionCard>
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
      className="group flex items-center gap-2 rounded-field px-2 py-2 transition-colors hover:bg-surface-hover"
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
            "grid size-5 shrink-0 place-items-center rounded-control border transition-colors",
            task.done ? "border-success bg-success text-white" : "border-border-strong text-transparent group-hover:border-primary",
          )}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <span className={cn("min-w-0 flex-1 truncate text-sm", task.done && "text-muted-2 line-through")}>
          {task.title}
        </span>
        {task.time && <span className="tabular text-2xs text-muted-2">{task.time}</span>}
        {!task.done && <PriorityBadge priority={task.priority} />}
      </button>
    </Reorder.Item>
  );
}
