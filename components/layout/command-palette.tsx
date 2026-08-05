"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Search,
  Plus,
  StickyNote,
  Droplets,
  Egg,
  SunMoon,
  ArrowRight,
  History,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { NAV } from "@/lib/nav";
import { dayKey, fuzzyScore } from "@/lib/utils";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  section: string;
  icon: LucideIcon;
  keywords?: string;
  run: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const open = useStore((s) => s.commandOpen);
  const setOpen = useStore((s) => s.setCommandOpen);
  const [q, setQ] = useState("");

  const tasks = useStore((s) => s.tasks);
  const projects = useStore((s) => s.projects);
  const jobs = useStore((s) => s.jobs);
  const addTask = useStore((s) => s.addTask);
  const addNote = useStore((s) => s.addNote);
  const addWater = useStore((s) => s.addWater);
  const logHealth = useStore((s) => s.logHealth);
  const recentCommands = useStore((s) => s.recentCommands);
  const pushRecent = useStore((s) => s.pushRecentCommand);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const close = () => setOpen(false);
  const run = (id: string, fn: () => void) => {
    pushRecent(id);
    fn();
    close();
  };

  // Static command registry (nav + quick actions) — used for search & recents.
  const registry = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = NAV.map((n) => ({
      id: `nav:${n.href}`,
      label: n.label,
      hint: n.hint,
      section: "Pages",
      icon: n.icon,
      keywords: n.hint,
      run: () => router.push(n.href),
    }));
    const actions: Cmd[] = [
      {
        id: "act:water",
        label: "Log a glass of water",
        section: "Quick actions",
        icon: Droplets,
        keywords: "hydrate drink health",
        run: () => {
          addWater(1);
          toast("💧 +1 glass of water");
        },
      },
      {
        id: "act:protein",
        label: "Add 30g protein",
        section: "Quick actions",
        icon: Egg,
        keywords: "diet macro nutrition",
        run: () => {
          const cur = useStore.getState().healthLog[dayKey()]?.protein ?? 0;
          logHealth({ protein: cur + 30 });
          toast("🥚 +30g protein logged");
        },
      },
      {
        id: "act:theme",
        label: "Toggle theme",
        section: "Quick actions",
        icon: SunMoon,
        keywords: "dark light appearance",
        run: () => setTheme(theme === "light" ? "dark" : "light"),
      },
      {
        id: "act:shortcuts",
        label: "Show keyboard shortcuts",
        section: "Quick actions",
        icon: CornerDownLeft,
        keywords: "keys help hotkeys",
        run: () => window.dispatchEvent(new Event("open-shortcuts")),
      },
    ];
    return [...actions, ...nav];
  }, [router, addWater, logHealth, setTheme, theme]);

  const registryById = useMemo(() => new Map(registry.map((c) => [c.id, c])), [registry]);

  // Ranked results when searching.
  const ranked = useMemo(() => {
    if (!q.trim()) return [];
    const scored = registry
      .map((c) => ({ c, s: Math.max(fuzzyScore(q, c.label), fuzzyScore(q, c.keywords ?? "") - 4) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.c);
    return scored;
  }, [q, registry]);

  const entityHits = useMemo(() => {
    if (!q.trim()) return { tasks: [], projects: [], jobs: [] };
    const m = (t: string) => fuzzyScore(q, t) >= 0;
    return {
      tasks: tasks.filter((t) => m(t.title)).slice(0, 4),
      projects: projects.filter((p) => m(p.name) || m(p.description)).slice(0, 4),
      jobs: jobs.filter((j) => m(j.company) || m(j.role)).slice(0, 3),
    };
  }, [q, tasks, projects, jobs]);

  const recents = recentCommands
    .map((id) => registryById.get(id))
    .filter(Boolean)
    .slice(0, 4) as Cmd[];

  const bySection = (section: string) => ranked.filter((c) => c.section === section);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-tile"
          >
            <Command shouldFilter={false} loop className="flex flex-col">
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="size-4 text-muted-2" />
                <Command.Input
                  autoFocus
                  value={q}
                  onValueChange={setQ}
                  placeholder="Search or type a command…"
                  className="h-14 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-2"
                />
                <kbd className="rounded-control border border-border px-1.5 py-0.5 font-mono text-3xs text-muted-2">ESC</kbd>
              </div>

              <Command.List className="max-h-[52vh] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-muted-2">
                  No results for “{q}”.
                </Command.Empty>

                {/* Create from query */}
                {q.trim() && (
                  <Group heading="Create">
                    <Item value="create-task" icon={Plus} onSelect={() => run("create:task", () => { addTask({ title: q, category: "Inbox", priority: "medium" }); toast.success("Task added", { description: q }); })}>
                      Create task <span className="text-muted-2">“{q}”</span>
                    </Item>
                    <Item value="create-note" icon={StickyNote} onSelect={() => run("create:note", () => { addNote(q); toast.success("Note saved"); })}>
                      Add note <span className="text-muted-2">“{q}”</span>
                    </Item>
                  </Group>
                )}

                {/* Recents when idle */}
                {!q.trim() && recents.length > 0 && (
                  <Group heading="Recent">
                    {recents.map((c) => (
                      <Item key={c.id} value={`recent-${c.id}`} icon={History} onSelect={() => run(c.id, c.run)}>
                        {c.label}
                      </Item>
                    ))}
                  </Group>
                )}

                {/* Idle default */}
                {!q.trim() && (
                  <>
                    <Group heading="Quick actions">
                      {registry.filter((c) => c.section === "Quick actions").map((c) => (
                        <Item key={c.id} value={`idle-${c.id}`} icon={c.icon} onSelect={() => run(c.id, c.run)}>
                          {c.label}
                        </Item>
                      ))}
                    </Group>
                    <Group heading="Jump to">
                      {registry.filter((c) => c.section === "Pages").slice(0, 6).map((c) => (
                        <Item key={c.id} value={`idle-${c.id}`} icon={c.icon} trailing={<ArrowRight className="size-3.5" />} onSelect={() => run(c.id, c.run)}>
                          {c.label}
                          {c.hint && <span className="ml-1 text-muted-2">— {c.hint}</span>}
                        </Item>
                      ))}
                    </Group>
                  </>
                )}

                {/* Ranked search results */}
                {q.trim() && bySection("Quick actions").length > 0 && (
                  <Group heading="Actions">
                    {bySection("Quick actions").map((c) => (
                      <Item key={c.id} value={`s-${c.id}`} icon={c.icon} onSelect={() => run(c.id, c.run)}>
                        {c.label}
                      </Item>
                    ))}
                  </Group>
                )}
                {q.trim() && bySection("Pages").length > 0 && (
                  <Group heading="Pages">
                    {bySection("Pages").map((c) => (
                      <Item key={c.id} value={`s-${c.id}`} icon={c.icon} trailing={<ArrowRight className="size-3.5" />} onSelect={() => run(c.id, c.run)}>
                        {c.label}
                        {c.hint && <span className="ml-1 text-muted-2">— {c.hint}</span>}
                      </Item>
                    ))}
                  </Group>
                )}

                {entityHits.tasks.length > 0 && (
                  <Group heading="Tasks">
                    {entityHits.tasks.map((t) => (
                      <Item key={t.id} value={`task-${t.id}`} icon={CornerDownLeft} onSelect={() => run("nav:/life", () => router.push("/life"))}>
                        {t.title}
                      </Item>
                    ))}
                  </Group>
                )}
                {entityHits.projects.length > 0 && (
                  <Group heading="Projects">
                    {entityHits.projects.map((p) => (
                      <Item key={p.id} value={`proj-${p.id}`} icon={CornerDownLeft} onSelect={() => run("nav:/projects", () => router.push("/projects"))}>
                        {p.name}
                      </Item>
                    ))}
                  </Group>
                )}
                {entityHits.jobs.length > 0 && (
                  <Group heading="Jobs">
                    {entityHits.jobs.map((j) => (
                      <Item key={j.id} value={`job-${j.id}`} icon={CornerDownLeft} onSelect={() => run("nav:/jobs", () => router.push("/jobs"))}>
                        {j.role} · {j.company}
                      </Item>
                    ))}
                  </Group>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-3xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-2"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  icon: Icon,
  children,
  onSelect,
  trailing,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onSelect: () => void;
  trailing?: React.ReactNode;
  value: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-field px-2.5 py-2 text-sm text-muted data-[selected=true]:bg-surface-strong data-[selected=true]:text-foreground"
    >
      <Icon className="size-4 shrink-0 text-muted-2" />
      <span className="flex-1 truncate">{children}</span>
      {trailing && <span className="text-muted-2">{trailing}</span>}
    </Command.Item>
  );
}
