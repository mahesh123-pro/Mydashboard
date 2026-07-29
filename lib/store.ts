"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { dayKey } from "@/lib/utils";
import type {
  Task,
  Habit,
  DailyHealth,
  Project,
  Subscription,
  SavingsGoal,
  Transaction,
  Meeting,
  JournalEntry,
  Job,
  ActivityItem,
  MealItem,
  MealSlot,
  Workout,
  PR,
  BodyPoint,
  AppSettings,
} from "@/lib/types";
import * as seed from "@/lib/data/seed";

const emptyHealth: DailyHealth = { water: 0, calories: 0, protein: 0, caloriesBurned: 0 };

type State = {
  profile: typeof seed.seedProfile;

  tasks: Task[];
  meetings: Meeting[];
  activity: ActivityItem[];
  notes: string[];

  habits: Habit[];
  habitLog: Record<string, Record<string, boolean>>;

  healthLog: Record<string, DailyHealth>;
  healthGoals: typeof seed.healthGoals;
  meals: Record<MealSlot, MealItem[]>;
  supplements: { id: string; name: string; dose: string; taken: boolean }[];

  body: BodyPoint[];
  workouts: Workout[];
  prs: PR[];

  projects: Project[];

  finance: typeof seed.financeSummary;
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];

  journal: JournalEntry[];
  jobs: Job[];

  recentCommands: string[];

  settings: AppSettings;

  isLoading: boolean;
  isSyncing: boolean;

  // ui (sidebar persisted, rest transient)
  sidebarCollapsed: boolean;
  commandOpen: boolean;

  // actions
  toggleTask: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "done">) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (ids: string[]) => void;

  toggleHabit: (habitId: string, day?: string) => void;
  reorderHabits: (ids: string[]) => void;
  pushRecentCommand: (id: string) => void;

  logHealth: (patch: Partial<DailyHealth>, day?: string) => void;
  addWater: (delta: number, day?: string) => void;
  toggleSupplement: (id: string) => void;
  addMeal: (slot: MealSlot, item: Omit<MealItem, "id">) => void;
  removeMeal: (slot: MealSlot, id: string) => void;

  addWorkout: (w: Omit<Workout, "id">) => void;
  toggleMilestone: (projectId: string, index: number) => void;

  addToSavings: (goalId: string, amount: number) => void;

  addNote: (text: string) => void;
  removeNote: (index: number) => void;

  addJournal: (e: Omit<JournalEntry, "id">) => void;
  cycleJob: (id: string) => void;

  addXp: (n: number) => void;
  pushActivity: (a: Omit<ActivityItem, "id">) => void;
  setProfile: (patch: Partial<State["profile"]>) => void;
  setSettings: (patch: Partial<AppSettings>) => void;
  setHealthGoals: (patch: Partial<State["healthGoals"]>) => void;

  setSidebarCollapsed: (v: boolean) => void;
  setCommandOpen: (v: boolean) => void;
  resetAll: () => void;
};

function initial() {
  return {
    profile: seed.seedProfile,
    tasks: seed.seedTasks,
    meetings: seed.seedMeetings,
    activity: seed.seedActivity,
    notes: seed.seedNotes,
    habits: seed.seedHabits,
    habitLog: seed.buildHabitLog(),
    healthLog: seed.buildHealthLog(),
    healthGoals: seed.healthGoals,
    meals: seed.seedMeals,
    supplements: seed.seedSupplements,
    body: seed.buildBody(),
    workouts: seed.buildWorkouts(),
    prs: seed.seedPRs,
    projects: seed.seedProjects,
    finance: seed.financeSummary,
    subscriptions: seed.seedSubscriptions,
    savingsGoals: seed.seedSavingsGoals,
    transactions: seed.seedTransactions,
    journal: seed.seedJournal,
    jobs: seed.seedJobs,
    settings: seed.defaultSettings,
  };
}

const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);
const JOB_CYCLE: Job["status"][] = ["saved", "applied", "interview", "offer", "rejected"];

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      isLoading: true,
      isSyncing: false,
      recentCommands: [],
      sidebarCollapsed: false,
      commandOpen: false,

      toggleTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
        if (task && !task.done) {
          get().addXp(15);
          get().pushActivity({
            text: `Completed: ${task.title}`,
            icon: "CheckCircle2",
            color: "#22c55e",
            ts: Date.now(),
          });
        }
      },
      addTask: (t) =>
        set((s) => ({ tasks: [{ ...t, id: uid("tk-"), done: false }, ...s.tasks] })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      reorderTasks: (ids) =>
        set((s) => {
          const map = new Map(s.tasks.map((t) => [t.id, t]));
          const ordered = ids.map((id) => map.get(id)).filter(Boolean) as Task[];
          const rest = s.tasks.filter((t) => !ids.includes(t.id));
          return { tasks: [...ordered, ...rest] };
        }),

      toggleHabit: (habitId, day = dayKey()) => {
        const cur = get().habitLog[habitId]?.[day] ?? false;
        set((s) => ({
          habitLog: {
            ...s.habitLog,
            [habitId]: { ...(s.habitLog[habitId] ?? {}), [day]: !cur },
          },
        }));
        if (!cur) {
          get().addXp(10);
          if (day === dayKey()) {
            const h = get().habits.find((x) => x.id === habitId);
            if (h)
              get().pushActivity({
                text: `Habit done: ${h.name}`,
                icon: h.icon,
                color: h.color,
                ts: Date.now(),
              });
          }
        }
      },
      reorderHabits: (ids) =>
        set((s) => {
          const map = new Map(s.habits.map((h) => [h.id, h]));
          const ordered = ids.map((id) => map.get(id)).filter(Boolean) as Habit[];
          const rest = s.habits.filter((h) => !ids.includes(h.id));
          return { habits: [...ordered, ...rest] };
        }),
      pushRecentCommand: (id) =>
        set((s) => ({ recentCommands: [id, ...s.recentCommands.filter((x) => x !== id)].slice(0, 6) })),

      logHealth: (patch, day = dayKey()) =>
        set((s) => ({
          healthLog: {
            ...s.healthLog,
            [day]: { ...emptyHealth, ...(s.healthLog[day] ?? {}), ...patch },
          },
        })),
      addWater: (delta, day = dayKey()) => {
        const cur = get().healthLog[day] ?? emptyHealth;
        get().logHealth({ water: Math.max(0, cur.water + delta) }, day);
      },
      toggleSupplement: (id) =>
        set((s) => ({
          supplements: s.supplements.map((x) => (x.id === id ? { ...x, taken: !x.taken } : x)),
        })),
      addMeal: (slot, item) =>
        set((s) => ({
          meals: { ...s.meals, [slot]: [...s.meals[slot], { ...item, id: uid("m-") }] },
        })),
      removeMeal: (slot, id) =>
        set((s) => ({ meals: { ...s.meals, [slot]: s.meals[slot].filter((m) => m.id !== id) } })),

      addWorkout: (w) => {
        set((s) => ({ workouts: [{ ...w, id: uid("wk-") }, ...s.workouts] }));
        get().addXp(20);
        get().pushActivity({
          text: `Logged ${w.title} — ${w.caloriesBurned} kcal burned`,
          icon: "Dumbbell",
          color: "#ef4444",
          ts: Date.now(),
        });
      },
      toggleMilestone: (projectId, index) => {
        const project = get().projects.find((p) => p.id === projectId);
        const willComplete = project ? !project.milestones[index]?.done : false;
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== projectId) return p;
            const milestones = p.milestones.map((m, i) =>
              i === index ? { ...m, done: !m.done } : m,
            );
            const done = milestones.filter((m) => m.done).length;
            const progress = Math.round((done / milestones.length) * 100);
            return { ...p, milestones, progress };
          }),
        }));
        if (willComplete && project) {
          get().addXp(25);
          get().pushActivity({
            text: `Milestone: ${project.milestones[index].title} (${project.name})`,
            icon: "Flag",
            color: project.color,
            ts: Date.now(),
          });
        }
      },

      addToSavings: (goalId, amount) => {
        const goal = get().savingsGoals.find((g) => g.id === goalId);
        set((s) => ({
          savingsGoals: s.savingsGoals.map((g) =>
            g.id === goalId ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g,
          ),
        }));
        if (goal)
          get().pushActivity({
            text: `Saved ₹${amount.toLocaleString("en-IN")} → ${goal.name}`,
            icon: "PiggyBank",
            color: "#14b8a6",
            ts: Date.now(),
          });
      },

      addNote: (text) => set((s) => ({ notes: [text, ...s.notes] })),
      removeNote: (index) => set((s) => ({ notes: s.notes.filter((_, i) => i !== index) })),

      addJournal: (e) => set((s) => ({ journal: [{ ...e, id: uid("j-") }, ...s.journal] })),
      cycleJob: (id) =>
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.id === id
              ? { ...j, status: JOB_CYCLE[(JOB_CYCLE.indexOf(j.status) + 1) % JOB_CYCLE.length] }
              : j,
          ),
        })),

      addXp: (n) => set((s) => ({ profile: { ...s.profile, xp: s.profile.xp + n } })),
      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setHealthGoals: (patch) => set((s) => ({ healthGoals: { ...s.healthGoals, ...patch } })),
      pushActivity: (a) =>
        set((s) => ({ activity: [{ ...a, id: uid("a-") }, ...s.activity].slice(0, 30) })),

      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setCommandOpen: (v) => set({ commandOpen: v }),
      resetAll: () => set({ ...initial() }),
    }),
    {
      name: "mahesh-os",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // rehydrate manually after mount to avoid SSR mismatch
      partialize: (s) => {
        const { commandOpen, isLoading, isSyncing, ...rest } = s;
        void commandOpen;
        void isLoading;
        void isSyncing;
        return rest;
      },
    },
  ),
);

/* ------------------------------ selectors ------------------------------ */
export function todayHealth(s: State, day = dayKey()): DailyHealth {
  return s.healthLog[day] ?? emptyHealth;
}

/** streak of consecutive days (ending today) with >= `threshold` habits done. */
export function currentStreak(s: State, threshold = 4) {
  let streak = 0;
  const today = new Date();
  for (let d = 0; d < 200; d++) {
    const day = new Date(today);
    day.setDate(day.getDate() - d);
    const key = dayKey(day);
    const done = s.habits.filter((h) => s.habitLog[h.id]?.[key]).length;
    if (done >= threshold) streak++;
    else if (d === 0) continue; // today may still be in progress
    else break;
  }
  return streak;
}

export function habitCompletion(s: State, day = dayKey()) {
  const done = s.habits.filter((h) => s.habitLog[h.id]?.[day]).length;
  return { done, total: s.habits.length };
}
