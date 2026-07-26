/** Second key after `g` → destination route (GitHub/Linear-style chords). */
export const GO_CHORDS: Record<string, { href: string; label: string }> = {
  d: { href: "/", label: "Dashboard" },
  m: { href: "/life", label: "My Life" },
  h: { href: "/habits", label: "Habits" },
  w: { href: "/gym", label: "Gym" },
  e: { href: "/diet", label: "Diet" },
  p: { href: "/projects", label: "Projects" },
  j: { href: "/jobs", label: "Jobs" },
  f: { href: "/finances", label: "Finances" },
  l: { href: "/learning", label: "Learning" },
  o: { href: "/goals", label: "Goals" },
  c: { href: "/calendar", label: "Calendar" },
  a: { href: "/analytics", label: "Analytics" },
  r: { href: "/resources", label: "Resources" },
  i: { href: "/assistant", label: "AI Assistant" },
  s: { href: "/settings", label: "Settings" },
};

export type ShortcutRow = { keys: string[]; label: string };
export type ShortcutGroup = { title: string; rows: ShortcutRow[] };

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "General",
    rows: [
      { keys: ["⌘", "K"], label: "Open command palette / search" },
      { keys: ["N"], label: "New task (quick add)" },
      { keys: ["T"], label: "Toggle light / dark theme" },
      { keys: ["\\"], label: "Collapse / expand sidebar" },
      { keys: ["?"], label: "Show this shortcuts panel" },
      { keys: ["Esc"], label: "Close any overlay" },
    ],
  },
  {
    title: "Go to (press G, then…)",
    rows: [
      { keys: ["G", "D"], label: "Dashboard" },
      { keys: ["G", "H"], label: "Habits" },
      { keys: ["G", "W"], label: "Gym (workout)" },
      { keys: ["G", "E"], label: "Diet (eat)" },
      { keys: ["G", "P"], label: "Projects" },
      { keys: ["G", "F"], label: "Finances" },
      { keys: ["G", "J"], label: "Jobs" },
      { keys: ["G", "I"], label: "AI Assistant" },
      { keys: ["G", "S"], label: "Settings" },
    ],
  },
];
