export type Priority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "planning" | "active" | "paused" | "shipped";
export type WorkoutType = "Push" | "Pull" | "Legs" | "Cardio";
export type JobStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  time?: string; // e.g. "14:30"
  done: boolean;
  project?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string; // lucide key
  color: string; // css color
  target?: number; // e.g. glasses/pages; undefined => boolean habit
  unit?: string;
}

export interface DailyHealth {
  water: number; // glasses
  calories: number;
  protein: number; // g
  caloriesBurned: number;
}

export interface MealItem {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealSlot = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export interface WorkoutSet {
  weight: number;
  reps: number;
}
export interface Exercise {
  name: string;
  sets: WorkoutSet[];
}
export interface Workout {
  id: string;
  date: string; // dayKey
  type: WorkoutType;
  title: string;
  exercises: Exercise[];
  durationMin: number;
  caloriesBurned: number;
}

export interface PR {
  exercise: string;
  weight: number;
  date: string;
}

export interface BodyPoint {
  date: string; // dayKey
  weight: number; // kg
  bodyFat: number; // %
}

export interface Milestone {
  title: string;
  done: boolean;
}
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  tech: string[];
  deadline: string; // ISO date
  progress: number; // 0..100
  repo?: string;
  deploy?: string;
  tasksDone: number;
  tasksTotal: number;
  milestones: Milestone[];
  timeSpentH: number;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  cycle: "monthly" | "yearly";
  category: string;
}
export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
}
export interface Transaction {
  id: string;
  label: string;
  amount: number; // negative = expense
  category: string;
  date: string;
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  kind: "meeting" | "deadline" | "focus" | "personal";
  with?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: "great" | "good" | "ok" | "low";
  title: string;
  body: string;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  remote: boolean;
  salary?: string;
  status: JobStatus;
  appliedDate?: string;
  platform?: string;
}

export interface ActivityItem {
  id: string;
  text: string;
  icon: string;
  time?: string; // static label (seed); generated items use `ts`
  ts?: number; // epoch ms — when present, render relative time
  color: string;
}

export type LayoutDensity = "compact" | "comfortable" | "spacious";
export type FontSize = "small" | "default" | "large";
export type GlassIntensity = "subtle" | "medium" | "bold";
export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD";
export type DateFormatOption = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
export type TimeFormatOption = "12h" | "24h";
export type WeekStart = "sunday" | "monday";

export interface AppSettings {
  animatedBackground: boolean;
  layoutDensity: LayoutDensity;
  fontSize: FontSize;
  glassIntensity: GlassIntensity;

  soundEnabled: boolean;
  desktopNotifications: boolean;

  currency: CurrencyCode;
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  weekStart: WeekStart;

  blurFinances: boolean;
  autoLockMin: number;

  pomodoroWork: number;
  pomodoroBreak: number;
}
