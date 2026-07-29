import {
  LayoutDashboard,
  HeartPulse,
  FolderKanban,
  Dumbbell,
  Salad,
  Briefcase,
  Building2,
  Handshake,
  GraduationCap,
  Wallet,
  Target,
  ListChecks,
  BookOpen,
  CalendarDays,
  LineChart,
  Library,
  Sparkles,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  group: "Overview" | "Personal" | "Work" | "Growth" | "System";
  hint?: string;
};

export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Overview", hint: "Your day at a glance" },
  { label: "My Life", href: "/life", icon: HeartPulse, group: "Personal", hint: "Daily planner & routine" },
  { label: "Habits", href: "/habits", icon: ListChecks, group: "Personal", hint: "Streaks & heatmap" },
  { label: "Gym", href: "/gym", icon: Dumbbell, group: "Personal", hint: "Workouts, PRs, body" },
  { label: "Diet", href: "/diet", icon: Salad, group: "Personal", hint: "Macros & meals" },
  { label: "Journal", href: "/journal", icon: BookOpen, group: "Personal", hint: "Notes & reflections" },

  { label: "Projects", href: "/projects", icon: FolderKanban, group: "Work", hint: "Idea → deployment" },
  { label: "Career", href: "/career", icon: GraduationCap, group: "Work", hint: "Skills & prep" },
  { label: "Jobs", href: "/jobs", icon: Briefcase, group: "Work", hint: "Applications tracker" },
  { label: "Freelancing", href: "/freelancing", icon: Handshake, group: "Work", hint: "Clients & invoices" },

  { label: "Learning", href: "/learning", icon: Building2, group: "Growth", hint: "Cloud, code, AI" },
  { label: "Finances", href: "/finances", icon: Wallet, group: "Growth", hint: "Money & net worth" },
  { label: "Goals", href: "/goals", icon: Target, group: "Growth", hint: "Short & long term" },

  { label: "Calendar", href: "/calendar", icon: CalendarDays, group: "System" },
  { label: "Analytics", href: "/analytics", icon: LineChart, group: "System" },
  { label: "Resources", href: "/resources", icon: Library, group: "System" },
  { label: "AI Assistant", href: "/assistant", icon: Sparkles, group: "System" },
  { label: "Profile", href: "/profile", icon: User, group: "System" },
  { label: "Settings", href: "/settings", icon: Settings, group: "System" },
];

export const NAV_GROUPS = ["Overview", "Personal", "Work", "Growth", "System"] as const;
