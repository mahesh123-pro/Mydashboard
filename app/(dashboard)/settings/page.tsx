"use client";

import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Palette,
  User,
  Database,
  Keyboard,
  Moon,
  Sun,
  Monitor,
  RotateCcw,
  Download,
  Upload,
  Bell,
  Volume2,
  VolumeX,
  Globe,
  Heart,
  Shield,
  Timer,
  Minus,
  Plus,
  X,
  Eye,
  EyeOff,
  LayoutGrid,
  Type,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useHydrated } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { SHORTCUT_GROUPS } from "@/lib/shortcuts";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/layout/profile-chip";
import { cn } from "@/lib/utils";
import type {
  LayoutDensity,
  FontSize,
  GlassIntensity,
  CurrencyCode,
  DateFormatOption,
  TimeFormatOption,
  WeekStart,
} from "@/lib/types";

const ACCENTS = ["#10b981", "#059669", "#14b8a6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];
const STORE_KEY = "mahesh-os";

function SectionLabel({ icon: Icon, label, color }: { icon: typeof Palette; label: string; color: string }) {
  return (
    <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
      <Icon className="size-4" style={{ color }} /> {label}
    </h3>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl px-1 py-2.5">
      <div className="min-w-0">
        <div className="text-sm text-foreground">{label}</div>
        {description && <div className="mt-0.5 text-xs text-muted-2">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer",
        on ? "bg-primary" : "bg-white/[0.1] border border-border",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200",
          on && "translate-x-5",
        )}
      />
    </button>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-white/[0.03] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
            value === o.value
              ? "bg-primary/20 text-primary shadow-sm"
              : "text-muted-2 hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SelectDropdown<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-9 appearance-none rounded-xl border border-border bg-white/[0.03] pl-3 pr-8 text-sm text-foreground outline-none focus:border-primary/50 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[var(--card-solid)] text-foreground">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-2" />
    </div>
  );
}

function NumberStepper({ value, onChange, min = 0, max = 999, step = 1, unit }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white/[0.03]">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="grid size-8 place-items-center rounded-l-xl text-muted-2 transition-colors hover:text-foreground disabled:opacity-30 cursor-pointer"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-[3rem] text-center text-sm tabular font-medium">
        {value}{unit && <span className="ml-0.5 text-xs text-muted-2">{unit}</span>}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        className="grid size-8 place-items-center rounded-r-xl text-muted-2 transition-colors hover:text-foreground disabled:opacity-30 cursor-pointer"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const healthGoals = useStore((s) => s.healthGoals);
  const setHealthGoals = useStore((s) => s.setHealthGoals);
  const resetAll = useStore((s) => s.resetAll);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newGoal, setNewGoal] = useState("");

  const exportData = () => {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return toast.error("Nothing to export yet");
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mahesh-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded");
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        JSON.parse(text);
        localStorage.setItem(STORE_KEY, text);
        useStore.persist.rehydrate();
        toast.success("Backup restored");
      } catch {
        toast.error("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  const addGoal = () => {
    const g = newGoal.trim();
    if (!g) return;
    if (profile.goals.includes(g)) return toast.error("Goal already exists");
    setProfile({ goals: [...profile.goals, g] });
    setNewGoal("");
    toast.success("Goal added");
  };

  const removeGoal = (goal: string) => {
    setProfile({ goals: profile.goals.filter((g) => g !== goal) });
    toast.success("Goal removed");
  };

  if (!hydrated) return <Skeleton className="h-[60vh] rounded-3xl" />;
  const isDark = theme !== "light";

  return (
    <div className="space-y-5">
      <PageHeader icon={SettingsIcon} title="Settings" subtitle="Make it yours." accent="#71717a" />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ── Appearance ────────────────────────────────── */}
        <GlassCard className="p-6">
          <SectionLabel icon={Palette} label="Appearance" color="#8b5cf6" />
          <div className="mt-4 space-y-1">
            <div className="mb-3">
              <div className="mb-2 text-xs text-muted-2">Theme</div>
              <div className="flex gap-2">
                {([
                  { v: "dark", icon: Moon, label: "Dark" },
                  { v: "light", icon: Sun, label: "Light" },
                  { v: "system", icon: Monitor, label: "System" },
                ] as const).map((t) => (
                  <button
                    key={t.v}
                    onClick={() => setTheme(t.v)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-sm transition-colors cursor-pointer",
                      theme === t.v
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border text-muted hover:text-foreground",
                    )}
                  >
                    <t.icon className="size-4" /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-2 text-xs text-muted-2">Accent color</div>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setProfile({ avatarColor: c });
                      toast.success("Accent updated");
                    }}
                    className={cn(
                      "size-9 rounded-xl transition-transform hover:scale-110 cursor-pointer",
                      profile.avatarColor === c && "ring-2 ring-white ring-offset-2 ring-offset-background",
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            <SettingRow label="Animated background" description="Ambient blobs & grid overlay">
              <Toggle
                on={settings.animatedBackground}
                onChange={(v) => {
                  setSettings({ animatedBackground: v });
                  toast.success(v ? "Background effects on" : "Background effects off");
                }}
              />
            </SettingRow>

            <SettingRow label="Layout density">
              <SegmentedControl<LayoutDensity>
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "comfortable", label: "Comfort" },
                  { value: "spacious", label: "Spacious" },
                ]}
                value={settings.layoutDensity}
                onChange={(v) => {
                  setSettings({ layoutDensity: v });
                  toast.success(`Layout: ${v}`);
                }}
              />
            </SettingRow>

            <SettingRow label="Font size">
              <SegmentedControl<FontSize>
                options={[
                  { value: "small", label: "Small" },
                  { value: "default", label: "Default" },
                  { value: "large", label: "Large" },
                ]}
                value={settings.fontSize}
                onChange={(v) => {
                  setSettings({ fontSize: v });
                  toast.success(`Font size: ${v}`);
                }}
              />
            </SettingRow>

            <SettingRow label="Glass intensity" description="Blur & transparency level">
              <SegmentedControl<GlassIntensity>
                options={[
                  { value: "subtle", label: "Subtle" },
                  { value: "medium", label: "Medium" },
                  { value: "bold", label: "Bold" },
                ]}
                value={settings.glassIntensity}
                onChange={(v) => {
                  setSettings({ glassIntensity: v });
                  toast.success(`Glass: ${v}`);
                }}
              />
            </SettingRow>
          </div>
        </GlassCard>

        {/* ── Profile ───────────────────────────────────── */}
        <GlassCard className="p-6">
          <SectionLabel icon={User} label="Profile" color="#10b981" />
          <div className="mt-4 flex items-center gap-4">
            <Avatar name={profile.name} color={profile.avatarColor} size={56} />
            <div className="flex-1 space-y-2">
              <input
                value={profile.name}
                onChange={(e) => setProfile({ name: e.target.value })}
                placeholder="Your name"
                className="h-10 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm outline-none focus:border-primary/50"
              />
            </div>
          </div>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ bio: e.target.value })}
            rows={2}
            placeholder="A short bio..."
            className="mt-3 w-full resize-none rounded-xl border border-border bg-white/[0.03] p-3 text-sm outline-none focus:border-primary/50"
          />
          <input
            value={profile.role}
            onChange={(e) => setProfile({ role: e.target.value })}
            placeholder="Your role (e.g., Software Engineer)"
            className="mt-2 h-10 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-muted outline-none focus:border-primary/50"
          />
          <div className="mt-3">
            <div className="mb-2 text-xs text-muted-2">Goals</div>
            <div className="flex flex-wrap gap-1.5">
              {profile.goals.map((g) => (
                <span
                  key={g}
                  className="group inline-flex items-center gap-1 rounded-lg border border-border bg-white/[0.03] px-2 py-1 text-[11px] text-muted"
                >
                  {g}
                  <button
                    onClick={() => removeGoal(g)}
                    className="ml-0.5 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger/20 hover:text-danger cursor-pointer"
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGoal()}
                placeholder="Add a goal..."
                className="h-8 flex-1 rounded-lg border border-border bg-white/[0.03] px-3 text-xs outline-none focus:border-primary/50"
              />
              <button
                onClick={addGoal}
                disabled={!newGoal.trim()}
                className="rounded-lg bg-primary/20 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/30 disabled:opacity-40 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </GlassCard>

        {/* ── Notifications & Sound ─────────────────────── */}
        <GlassCard className="p-6">
          <SectionLabel icon={Bell} label="Notifications & Sound" color="#f59e0b" />
          <div className="mt-4 space-y-1">
            <SettingRow label="Sound effects" description="Play sounds on actions (XP, habits, etc.)">
              <Toggle
                on={settings.soundEnabled}
                onChange={(v) => {
                  setSettings({ soundEnabled: v });
                  toast.success(v ? "Sounds on" : "Sounds muted");
                }}
              />
            </SettingRow>
            <SettingRow label="Desktop notifications" description="Browser push for reminders & deadlines">
              <Toggle
                on={settings.desktopNotifications}
                onChange={(v) => {
                  if (v && typeof Notification !== "undefined" && Notification.permission !== "granted") {
                    Notification.requestPermission().then((p) => {
                      if (p === "granted") {
                        setSettings({ desktopNotifications: true });
                        toast.success("Notifications enabled");
                      } else {
                        toast.error("Permission denied by browser");
                      }
                    });
                  } else {
                    setSettings({ desktopNotifications: v });
                    toast.success(v ? "Notifications on" : "Notifications off");
                  }
                }}
              />
            </SettingRow>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <SectionLabel icon={Timer} label="Focus Timer" color="#6366f1" />
            <div className="mt-3 space-y-1">
              <SettingRow label="Work session" description="Pomodoro focus duration">
                <NumberStepper
                  value={settings.pomodoroWork}
                  onChange={(v) => setSettings({ pomodoroWork: v })}
                  min={5}
                  max={90}
                  step={5}
                  unit="min"
                />
              </SettingRow>
              <SettingRow label="Break session" description="Rest between sessions">
                <NumberStepper
                  value={settings.pomodoroBreak}
                  onChange={(v) => setSettings({ pomodoroBreak: v })}
                  min={1}
                  max={30}
                  step={1}
                  unit="min"
                />
              </SettingRow>
            </div>
          </div>
        </GlassCard>

        {/* ── Regional ──────────────────────────────────── */}
        <GlassCard className="p-6">
          <SectionLabel icon={Globe} label="Regional" color="#06b6d4" />
          <div className="mt-4 space-y-1">
            <SettingRow label="Currency">
              <SelectDropdown<CurrencyCode>
                options={[
                  { value: "INR", label: "₹ INR" },
                  { value: "USD", label: "$ USD" },
                  { value: "EUR", label: "€ EUR" },
                  { value: "GBP", label: "£ GBP" },
                  { value: "JPY", label: "¥ JPY" },
                  { value: "AUD", label: "A$ AUD" },
                  { value: "CAD", label: "C$ CAD" },
                ]}
                value={settings.currency}
                onChange={(v) => {
                  setSettings({ currency: v });
                  toast.success(`Currency: ${v}`);
                }}
              />
            </SettingRow>
            <SettingRow label="Date format">
              <SelectDropdown<DateFormatOption>
                options={[
                  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                ]}
                value={settings.dateFormat}
                onChange={(v) => {
                  setSettings({ dateFormat: v });
                  toast.success(`Date format: ${v}`);
                }}
              />
            </SettingRow>
            <SettingRow label="Time format">
              <SegmentedControl<TimeFormatOption>
                options={[
                  { value: "12h", label: "12h" },
                  { value: "24h", label: "24h" },
                ]}
                value={settings.timeFormat}
                onChange={(v) => {
                  setSettings({ timeFormat: v });
                  toast.success(`Time: ${v}`);
                }}
              />
            </SettingRow>
            <SettingRow label="Week starts on">
              <SegmentedControl<WeekStart>
                options={[
                  { value: "sunday", label: "Sunday" },
                  { value: "monday", label: "Monday" },
                ]}
                value={settings.weekStart}
                onChange={(v) => {
                  setSettings({ weekStart: v });
                  toast.success(`Week starts: ${v}`);
                }}
              />
            </SettingRow>
          </div>
        </GlassCard>

        {/* ── Health & Fitness Goals ────────────────────── */}
        <GlassCard className="p-6">
          <SectionLabel icon={Heart} label="Health & Fitness Goals" color="#ef4444" />
          <p className="mt-2 text-xs text-muted-2">
            Set your daily targets. These are used across the Health, Gym, and Home pages.
          </p>
          <div className="mt-4 space-y-1">
            <SettingRow label="Water target" description="Glasses per day">
              <NumberStepper
                value={healthGoals.water}
                onChange={(v) => setHealthGoals({ water: v })}
                min={1}
                max={20}
                step={1}
              />
            </SettingRow>
            <SettingRow label="Calorie target" description="Daily intake goal">
              <NumberStepper
                value={healthGoals.calories}
                onChange={(v) => setHealthGoals({ calories: v })}
                min={1000}
                max={5000}
                step={100}
                unit="kcal"
              />
            </SettingRow>
            <SettingRow label="Protein target" description="Daily protein goal">
              <NumberStepper
                value={healthGoals.protein}
                onChange={(v) => setHealthGoals({ protein: v })}
                min={50}
                max={400}
                step={10}
                unit="g"
              />
            </SettingRow>
            <SettingRow label="Burn target" description="Calories burned daily">
              <NumberStepper
                value={healthGoals.burn}
                onChange={(v) => setHealthGoals({ burn: v })}
                min={100}
                max={2000}
                step={50}
                unit="kcal"
              />
            </SettingRow>
          </div>
        </GlassCard>

        {/* ── Privacy & Security ────────────────────────── */}
        <GlassCard className="p-6">
          <SectionLabel icon={Shield} label="Privacy & Security" color="#a855f7" />
          <div className="mt-4 space-y-1">
            <SettingRow label="Blur finances" description="Hide amounts on the Finance page by default">
              <Toggle
                on={settings.blurFinances}
                onChange={(v) => {
                  setSettings({ blurFinances: v });
                  toast.success(v ? "Finances hidden" : "Finances visible");
                }}
              />
            </SettingRow>
            <SettingRow label="Auto-lock" description="Lock after inactivity (0 = disabled)">
              <NumberStepper
                value={settings.autoLockMin}
                onChange={(v) => setSettings({ autoLockMin: v })}
                min={0}
                max={120}
                step={5}
                unit="min"
              />
            </SettingRow>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <SectionLabel icon={Keyboard} label="Keyboard Shortcuts" color="#14b8a6" />
            <div className="mt-3 space-y-1.5">
              {SHORTCUT_GROUPS[0].rows.map((sc) => (
                <div key={sc.label} className="flex items-center justify-between rounded-xl px-2 py-2 text-sm">
                  <span className="text-muted">{sc.label}</span>
                  <span className="flex items-center gap-1">
                    {sc.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="grid h-6 min-w-6 place-items-center rounded-md border border-border bg-white/[0.03] px-1.5 font-mono text-[11px] text-muted-2"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.dispatchEvent(new Event("open-shortcuts"))}
              className="mt-2 rounded-lg border border-border px-2 py-1 text-[11px] text-muted-2 transition-colors hover:text-foreground cursor-pointer"
            >
              View all shortcuts · ?
            </button>
          </div>
        </GlassCard>

        {/* ── Data ──────────────────────────────────────── */}
        <GlassCard className="p-6 lg:col-span-2">
          <SectionLabel icon={Database} label="Data Management" color="#f59e0b" />
          <p className="mt-3 text-sm text-muted">
            Your data lives locally in this browser. Export a backup, restore it on another device, or
            reset to the demo dataset.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportData}>
              <Download className="size-4" /> Export backup
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" /> Import backup
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importData(f);
                e.target.value = "";
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                resetAll();
                toast.success("Data reset to defaults");
              }}
            >
              <RotateCcw className="size-4" /> Reset all data
            </Button>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-white/[0.02] p-3 text-xs text-muted-2">
            v2 roadmap: cloud sync &amp; Google / GitHub login for cross-device access.
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
