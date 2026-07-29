import { dayKey } from "@/lib/utils";
import type {
  Task,
  Habit,
  DailyHealth,
  Workout,
  PR,
  BodyPoint,
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
} from "@/lib/types";

/* Deterministic pseudo-random in [0,1) from a string — avoids hydration drift. */
function rand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

function offsetKey(daysAgo: number, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() - daysAgo);
  return dayKey(d);
}

/* ------------------------------- profile ------------------------------- */
export const seedProfile = {
  name: "Mahesh",
  bio: "Full-stack dev · founder-in-progress · building in public.",
  role: "Software Engineer & Founder",
  location: "Earth",
  xp: 6480,
  streak: 24,
  goals: ["Ship 3 products", "AWS certified", "₹1L/mo freelance", "12% body fat"],
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
  socials: {
    github: "",
    twitter: "",
    linkedin: "",
    website: "",
  },
  avatarColor: "#10b981",
  avatarUrl: "",
  coverUrl: "",
};

/* ------------------------------- habits -------------------------------- */
export const seedHabits: Habit[] = [
  { id: "h-wake", name: "Wake 5:30 AM", icon: "Sunrise", color: "#f59e0b" },
  { id: "h-meditate", name: "Meditation", icon: "Brain", color: "#8b5cf6" },
  { id: "h-workout", name: "Workout", icon: "Dumbbell", color: "#ef4444" },
  { id: "h-water", name: "Water", icon: "Droplets", color: "#06b6d4", target: 8, unit: "glasses" },
  { id: "h-protein", name: "Hit Protein", icon: "Egg", color: "#22c55e" },
  { id: "h-code", name: "Deep Work Coding", icon: "Code2", color: "#6366f1" },
  { id: "h-read", name: "Read 20 pages", icon: "BookOpen", color: "#a78bfa" },
  { id: "h-nosugar", name: "No Sugar", icon: "CandyOff", color: "#f472b6" },
  { id: "h-walk", name: "8k Steps", icon: "Footprints", color: "#34d399" },
  { id: "h-journal", name: "Journal", icon: "PenLine", color: "#e879f9" },
];

/** Build ~140 days of realistic per-habit completion history. */
export function buildHabitLog(base = new Date()) {
  const log: Record<string, Record<string, boolean>> = {};
  for (const h of seedHabits) {
    log[h.id] = {};
    // each habit has a baseline consistency
    const baseline = 0.55 + rand(h.id) * 0.4;
    for (let d = 0; d < 140; d++) {
      const key = offsetKey(d, base);
      const recencyBoost = d < 28 ? 0.12 : 0; // stronger lately
      const weekendDip = new Date(base.getTime() - d * 864e5).getDay() % 6 === 0 ? -0.1 : 0;
      const roll = rand(h.id + key);
      log[h.id][key] = roll < baseline + recencyBoost + weekendDip;
    }
    // guarantee today mostly in-progress (some done, some not)
  }
  // Make today partially complete for a live feel
  const today = dayKey(base);
  log["h-water"][today] = false;
  log["h-workout"][today] = true;
  log["h-code"][today] = true;
  log["h-meditate"][today] = true;
  log["h-read"][today] = false;
  log["h-protein"][today] = false;
  return log;
}

/* ------------------------------- health -------------------------------- */
export const healthGoals = {
  water: 8,
  calories: 2600,
  protein: 160,
  burn: 500,
};

export function buildHealthLog(base = new Date()): Record<string, DailyHealth> {
  const log: Record<string, DailyHealth> = {};
  for (let d = 0; d < 14; d++) {
    const key = offsetKey(d, base);
    const r = rand("health" + key);
    log[key] = {
      water: 4 + Math.round(r * 4),
      calories: 1900 + Math.round(rand("cal" + key) * 700),
      protein: 110 + Math.round(rand("pro" + key) * 60),
      caloriesBurned: 350 + Math.round(rand("burn" + key) * 300),
    };
  }
  // Today mid-progress
  log[dayKey(base)] = { water: 5, calories: 1640, protein: 96, caloriesBurned: 420 };
  return log;
}

export const seedMeals: Record<MealSlot, MealItem[]> = {
  Breakfast: [
    { id: "m1", name: "Oats + Whey + Banana", kcal: 420, protein: 38, carbs: 52, fat: 8 },
    { id: "m2", name: "4 Egg Whites + 2 Eggs", kcal: 260, protein: 26, carbs: 2, fat: 15 },
  ],
  Lunch: [
    { id: "m3", name: "Chicken Rice Bowl", kcal: 640, protein: 48, carbs: 70, fat: 16 },
    { id: "m4", name: "Mixed Salad", kcal: 120, protein: 4, carbs: 12, fat: 6 },
  ],
  Dinner: [{ id: "m5", name: "Paneer + Roti + Dal", kcal: 560, protein: 32, carbs: 54, fat: 20 }],
  Snacks: [{ id: "m6", name: "Greek Yogurt + Almonds", kcal: 220, protein: 18, carbs: 12, fat: 10 }],
};

export const seedSupplements = [
  { id: "s1", name: "Whey Protein", dose: "1 scoop", taken: true },
  { id: "s2", name: "Creatine", dose: "5 g", taken: true },
  { id: "s3", name: "Multivitamin", dose: "1 tab", taken: false },
  { id: "s4", name: "Omega-3", dose: "2 caps", taken: false },
];

/* -------------------------------- gym ---------------------------------- */
export const bodyHeightCm = 178;

export function buildBody(base = new Date()): BodyPoint[] {
  const pts: BodyPoint[] = [];
  for (let w = 8; w >= 0; w--) {
    const key = offsetKey(w * 7, base);
    pts.push({
      date: key,
      weight: +(78.5 - (8 - w) * 0.35 + (rand("w" + key) - 0.5) * 0.6).toFixed(1),
      bodyFat: +(17.5 - (8 - w) * 0.25 + (rand("bf" + key) - 0.5) * 0.4).toFixed(1),
    });
  }
  return pts;
}

export function buildWorkouts(base = new Date()): Workout[] {
  const plan: { type: Workout["type"]; title: string; ex: [string, number, number][] }[] = [
    {
      type: "Push",
      title: "Push Day",
      ex: [
        ["Bench Press", 80, 6],
        ["Overhead Press", 50, 8],
        ["Incline DB Press", 30, 10],
        ["Cable Fly", 20, 12],
      ],
    },
    {
      type: "Pull",
      title: "Pull Day",
      ex: [
        ["Deadlift", 140, 4],
        ["Weighted Pull-ups", 20, 6],
        ["Barbell Row", 70, 8],
        ["Face Pull", 25, 15],
      ],
    },
    {
      type: "Legs",
      title: "Leg Day",
      ex: [
        ["Squat", 120, 5],
        ["Romanian Deadlift", 90, 8],
        ["Leg Press", 200, 10],
        ["Calf Raise", 80, 15],
      ],
    },
    { type: "Cardio", title: "Zone 2 + Core", ex: [["Incline Walk", 0, 0], ["Hanging Leg Raise", 0, 15]] },
  ];
  const workouts: Workout[] = [];
  const dayGaps = [1, 2, 4, 5, 7, 8, 10, 11];
  dayGaps.forEach((g, i) => {
    const p = plan[i % plan.length];
    const key = offsetKey(g, base);
    workouts.push({
      id: "wk-" + i,
      date: key,
      type: p.type,
      title: p.title,
      durationMin: 55 + Math.round(rand("dur" + key) * 25),
      caloriesBurned: 380 + Math.round(rand("cb" + key) * 220),
      exercises: p.ex.map(([name, weight, reps]) => ({
        name,
        sets: Array.from({ length: 3 }, () => ({
          weight: weight + Math.round((rand(name + key) - 0.5) * 5),
          reps,
        })),
      })),
    });
  });
  return workouts;
}

export const seedPRs: PR[] = [
  { exercise: "Bench Press", weight: 90, date: offsetKey(9) },
  { exercise: "Squat", weight: 130, date: offsetKey(16) },
  { exercise: "Deadlift", weight: 150, date: offsetKey(23) },
  { exercise: "Overhead Press", weight: 55, date: offsetKey(30) },
  { exercise: "Pull-up (added)", weight: 25, date: offsetKey(12) },
];

/* ------------------------------ projects ------------------------------- */
export const seedProjects: Project[] = [
  {
    id: "p-krishi",
    name: "KrishiUnnati",
    description: "AI crop-advisory & mandi price platform for farmers.",
    status: "active",
    priority: "high",
    tech: ["Next.js", "FastAPI", "Postgres", "TensorFlow"],
    deadline: offsetKey(-24),
    progress: 68,
    repo: "github.com/mahesh/krishiunnati",
    deploy: "krishiunnati.app",
    tasksDone: 34,
    tasksTotal: 50,
    timeSpentH: 142,
    color: "#22c55e",
    milestones: [
      { title: "MVP dashboard", done: true },
      { title: "Price prediction model", done: true },
      { title: "Farmer onboarding flow", done: false },
      { title: "Launch pilot (50 farmers)", done: false },
    ],
  },
  {
    id: "p-mana",
    name: "ManaKrishi",
    description: "Premium drone-agritech booking & analytics site.",
    status: "active",
    priority: "high",
    tech: ["Next.js", "Tailwind", "Node", "Mongo"],
    deadline: offsetKey(-10),
    progress: 82,
    repo: "github.com/mahesh/manakrishi",
    deploy: "manakrishi.in",
    tasksDone: 41,
    tasksTotal: 48,
    timeSpentH: 96,
    color: "#06b6d4",
    milestones: [
      { title: "Booking backend", done: true },
      { title: "Landing redesign", done: true },
      { title: "Analytics dashboard", done: false },
    ],
  },
  {
    id: "p-visa",
    name: "VisaEnsure CRM",
    description: "Immigration operations platform for a visa consultancy.",
    status: "active",
    priority: "urgent",
    tech: ["Next.js", "Prisma", "Postgres", "Clerk"],
    deadline: offsetKey(-6),
    progress: 45,
    repo: "github.com/mahesh/visaensure",
    tasksDone: 22,
    tasksTotal: 60,
    timeSpentH: 78,
    color: "#6366f1",
    milestones: [
      { title: "Phase 1 PRD", done: true },
      { title: "Client pipeline", done: false },
      { title: "Document vault", done: false },
    ],
  },
  {
    id: "p-portfolio",
    name: "3D Portfolio",
    description: "Futuristic React-Three-Fiber personal portfolio.",
    status: "paused",
    priority: "medium",
    tech: ["React", "R3F", "GSAP"],
    deadline: offsetKey(-40),
    progress: 55,
    repo: "github.com/mahesh/portfolio",
    tasksDone: 18,
    tasksTotal: 33,
    timeSpentH: 40,
    color: "#8b5cf6",
    milestones: [
      { title: "Hero scene", done: true },
      { title: "Projects gallery", done: true },
      { title: "Resume + contact", done: false },
    ],
  },
  {
    id: "p-prolance",
    name: "Prolance",
    description: "Freelancer CRM SaaS — clients, invoices, proposals.",
    status: "planning",
    priority: "medium",
    tech: ["Next.js", "Supabase", "Stripe"],
    deadline: offsetKey(-60),
    progress: 18,
    tasksDone: 7,
    tasksTotal: 40,
    timeSpentH: 22,
    color: "#f59e0b",
    milestones: [
      { title: "Scope & schema", done: true },
      { title: "Auth + billing", done: false },
    ],
  },
  {
    id: "p-client",
    name: "Bloom Studio (Client)",
    description: "Marketing site + CMS for a design studio.",
    status: "shipped",
    priority: "low",
    tech: ["Astro", "Sanity"],
    deadline: offsetKey(14),
    progress: 100,
    deploy: "bloomstudio.co",
    tasksDone: 26,
    tasksTotal: 26,
    timeSpentH: 34,
    color: "#ec4899",
    milestones: [{ title: "Delivered & paid", done: true }],
  },
];

/* ------------------------------ finances ------------------------------- */
export const financeSummary = {
  monthlyIncome: 92000,
  monthlyExpenses: 41500,
  savings: 285000,
  emergencyFund: 180000,
  investments: 340000,
  netWorth: 625000,
};

export const spendingByCategory = [
  { name: "Rent", value: 15000, color: "#6366f1" },
  { name: "Food", value: 8500, color: "#8b5cf6" },
  { name: "Subscriptions", value: 3200, color: "#06b6d4" },
  { name: "Transport", value: 4200, color: "#22c55e" },
  { name: "Learning", value: 3600, color: "#f59e0b" },
  { name: "Misc", value: 7000, color: "#ef4444" },
];

export const seedSubscriptions: Subscription[] = [
  { id: "sub1", name: "ChatGPT Plus", amount: 1700, cycle: "monthly", category: "AI" },
  { id: "sub2", name: "Vercel Pro", amount: 1700, cycle: "monthly", category: "Dev" },
  { id: "sub3", name: "Notion", amount: 800, cycle: "monthly", category: "Productivity" },
  { id: "sub4", name: "Spotify", amount: 119, cycle: "monthly", category: "Music" },
  { id: "sub5", name: "iCloud 2TB", amount: 749, cycle: "monthly", category: "Storage" },
  { id: "sub6", name: "AWS", amount: 2400, cycle: "monthly", category: "Cloud" },
];

export const seedSavingsGoals: SavingsGoal[] = [
  { id: "sg1", name: "New MacBook Pro", target: 250000, saved: 165000 },
  { id: "sg2", name: "Emergency Fund (6mo)", target: 300000, saved: 180000 },
  { id: "sg3", name: "Japan Trip", target: 200000, saved: 62000 },
];

export function buildNetWorth(base = new Date()) {
  const pts: { date: string; value: number }[] = [];
  for (let m = 11; m >= 0; m--) {
    const d = new Date(base);
    d.setMonth(d.getMonth() - m);
    pts.push({
      date: d.toLocaleDateString("en-US", { month: "short" }),
      value: 380000 + (11 - m) * 21000 + Math.round((rand("nw" + m) - 0.5) * 18000),
    });
  }
  return pts;
}

export const seedTransactions: Transaction[] = [
  { id: "t1", label: "Client payment — Bloom Studio", amount: 45000, category: "Income", date: offsetKey(1) },
  { id: "t2", label: "AWS invoice", amount: -2400, category: "Cloud", date: offsetKey(2) },
  { id: "t3", label: "Groceries", amount: -3200, category: "Food", date: offsetKey(2) },
  { id: "t4", label: "Whey + Creatine", amount: -4100, category: "Health", date: offsetKey(4) },
  { id: "t5", label: "Upwork payout", amount: 28000, category: "Income", date: offsetKey(5) },
  { id: "t6", label: "Metro card recharge", amount: -1000, category: "Transport", date: offsetKey(6) },
];

/* -------------------------------- day ---------------------------------- */
export const seedTasks: Task[] = [
  { id: "tk1", title: "Fix VisaEnsure client pipeline bug", category: "Code", priority: "urgent", time: "10:00", done: false, project: "VisaEnsure CRM" },
  { id: "tk2", title: "Ship ManaKrishi analytics dashboard", category: "Code", priority: "high", time: "12:30", done: false, project: "ManaKrishi" },
  { id: "tk3", title: "AWS SAA — 2 practice sets", category: "Learning", priority: "high", time: "16:00", done: false },
  { id: "tk4", title: "Reply to 3 Upwork proposals", category: "Freelance", priority: "medium", time: "18:00", done: false },
  { id: "tk5", title: "Leg day @ gym", category: "Health", priority: "medium", time: "19:30", done: true },
  { id: "tk6", title: "Read 20 pages — Deep Work", category: "Growth", priority: "low", time: "22:00", done: false },
  { id: "tk7", title: "Morning meditation + journal", category: "Mind", priority: "low", time: "06:00", done: true },
];

export const seedMeetings: Meeting[] = [
  { id: "mt1", title: "Standup — KrishiUnnati team", time: "09:30", kind: "meeting", with: "3 people" },
  { id: "mt2", title: "Client call — Bloom Studio", time: "14:00", kind: "meeting", with: "Ananya" },
  { id: "mt3", title: "VisaEnsure Phase 1 deadline", time: "23:59", kind: "deadline" },
  { id: "mt4", title: "Deep work — no meetings", time: "15:00", kind: "focus" },
];

export const seedActivity: ActivityItem[] = [
  { id: "a1", text: "Completed Leg Day — 620 kcal burned", icon: "Dumbbell", time: "2h ago", color: "#ef4444" },
  { id: "a2", text: "Pushed 3 commits to ManaKrishi", icon: "GitCommitHorizontal", time: "4h ago", color: "#06b6d4" },
  { id: "a3", text: "Logged 96g protein", icon: "Egg", time: "5h ago", color: "#22c55e" },
  { id: "a4", text: "Finished AWS module 7", icon: "GraduationCap", time: "6h ago", color: "#f59e0b" },
  { id: "a5", text: "New PR: Bench Press 90kg", icon: "Trophy", time: "1d ago", color: "#8b5cf6" },
];

export const seedJournal: JournalEntry[] = [
  { id: "j1", date: offsetKey(0), mood: "good", title: "Momentum day", body: "Shipped the analytics view. Felt in flow for 3 hours straight. Need to sleep earlier." },
  { id: "j2", date: offsetKey(1), mood: "great", title: "Big win", body: "Client paid + hit a bench PR. Discipline is compounding." },
  { id: "j3", date: offsetKey(3), mood: "ok", title: "Slow but steady", body: "Low energy, still did the minimums. Showing up matters." },
];

export const seedJobs: Job[] = [
  { id: "jb1", company: "Vercel", role: "Frontend Engineer", location: "Remote", remote: true, salary: "$120k–150k", status: "interview", appliedDate: offsetKey(9), platform: "LinkedIn" },
  { id: "jb2", company: "Razorpay", role: "SDE-2", location: "Bangalore", remote: false, salary: "₹28–34 LPA", status: "applied", appliedDate: offsetKey(4), platform: "Company site" },
  { id: "jb3", company: "Supabase", role: "DevRel Engineer", location: "Remote", remote: true, salary: "$90k–120k", status: "saved", platform: "YC Jobs" },
  { id: "jb4", company: "Zomato", role: "Full-stack", location: "Gurgaon", remote: false, status: "rejected", appliedDate: offsetKey(20), platform: "Referral" },
  { id: "jb5", company: "Stripe", role: "Backend Engineer", location: "Remote", remote: true, salary: "$130k+", status: "offer", appliedDate: offsetKey(28), platform: "LinkedIn" },
];

export const seedNotes = [
  "Idea: AI that turns gym logs into a weekly deload plan.",
  "Follow up with Ananya re: CMS handoff.",
  "Try Neon branching for VisaEnsure previews.",
];

export const defaultSettings: import("@/lib/types").AppSettings = {
  animatedBackground: true,
  layoutDensity: "comfortable",
  fontSize: "default",
  glassIntensity: "medium",
  soundEnabled: true,
  desktopNotifications: false,
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  weekStart: "monday",
  blurFinances: false,
  autoLockMin: 0,
  pomodoroWork: 25,
  pomodoroBreak: 5,
};

export const quotes = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
];

export function quoteOfDay(base = new Date()) {
  const idx = base.getFullYear() * 366 + dayKeyOfYear(base);
  return quotes[idx % quotes.length];
}
function dayKeyOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 864e5);
}

/* AI insights (deterministic morning brief) */
export const seedInsights = [
  { icon: "Target", title: "Today's priority", text: "VisaEnsure Phase 1 is due tonight — front-load it before the client call.", color: "#6366f1" },
  { icon: "Dumbbell", title: "Training", text: "It's Leg Day. You're -0.35kg on trend — keep protein ≥ 160g.", color: "#ef4444" },
  { icon: "TrendingUp", title: "Opportunity", text: "Your Stripe offer is live. Compare TC before replying to Razorpay.", color: "#22c55e" },
  { icon: "AlertTriangle", title: "Risk alert", text: "3 subscriptions renew this week (₹4.2k). Cancel iCloud if unused.", color: "#f59e0b" },
];
