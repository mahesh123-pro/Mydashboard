"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { usePageReady } from "@/lib/hooks";
import { toast } from "sonner";
import {
  Camera,
  MapPin,
  Briefcase,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Plus,
  X,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/layout/profile-chip";
import { compressImage, cn } from "@/lib/utils";

export default function ProfilePage() {
  const ready = usePageReady();
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const [newSkill, setNewSkill] = useState("");

  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  if (!ready) return <Skeleton className="h-[60vh] rounded-3xl" />;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      const toastId = toast.loading("Processing image...");
      // For avatar, we can compress heavily. For cover, less so.
      const compressed = await compressImage(file, type === "avatar" ? 400 : 1200, type === "avatar" ? 0.7 : 0.8);
      
      if (type === "avatar") {
        setProfile({ avatarUrl: compressed });
      } else {
        setProfile({ coverUrl: compressed });
      }
      
      toast.success(`${type === "avatar" ? "Avatar" : "Cover photo"} updated`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to process image. It might be too large.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    const currentSkills = profile.skills || [];
    if (currentSkills.includes(s)) return toast.error("Skill already exists");
    setProfile({ skills: [...currentSkills, s] });
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setProfile({ skills: (profile.skills || []).filter((s) => s !== skill) });
  };

  const updateSocial = (network: keyof typeof profile.socials, value: string) => {
    setProfile({
      socials: { ...profile.socials, [network]: value }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader icon={User} title="My Profile" subtitle="Your identity and personal brand." accent="#10b981" />

      {/* Header Banner & Avatar */}
      <GlassCard className="overflow-hidden p-0">
        <div className="relative h-48 w-full sm:h-64">
          {profile.coverUrl ? (
            <img src={profile.coverUrl} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
          )}
          <button
            onClick={() => coverRef.current?.click()}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/70 cursor-pointer"
          >
            <ImageIcon className="size-4" /> Change Cover
          </button>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, "cover")}
          />
        </div>

        <div className="relative px-6 pb-6 sm:px-10">
          <div className="relative -mt-16 sm:-mt-20 flex justify-between items-end">
            <div className="group relative">
              <div className="rounded-3xl border-4 border-[var(--background)] bg-background">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="size-32 rounded-[1.25rem] object-cover sm:size-40"
                  />
                ) : (
                  <Avatar name={profile.name} color={profile.avatarColor} size={128} />
                )}
              </div>
              <button
                onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 m-1 flex items-center justify-center rounded-3xl bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 cursor-pointer text-white"
              >
                <Camera className="size-8" />
              </button>
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "avatar")}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{profile.name || "Your Name"}</h1>
              <p className="mt-1 text-lg text-muted">{profile.role || "Your Role"}</p>
            </div>
            {profile.location && (
              <div className="flex items-center gap-2 text-sm text-muted-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-border">
                <MapPin className="size-4" />
                {profile.location}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Personal Info */}
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" /> Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-2">Full Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ name: e.target.value })}
                  placeholder="Mahesh"
                  className="h-10 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-2">Role</label>
                <input
                  value={profile.role}
                  onChange={(e) => setProfile({ role: e.target.value })}
                  placeholder="Software Engineer"
                  className="h-10 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-muted-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ bio: e.target.value })}
                  placeholder="A short bio..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-white/[0.03] p-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-muted-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
                  <input
                    value={profile.location || ""}
                    onChange={(e) => setProfile({ location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="h-10 w-full rounded-xl border border-border bg-white/[0.03] pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="size-4 text-secondary" /> Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-2.5 py-1.5 text-xs text-foreground transition-colors hover:bg-white/[0.05]"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger/20 hover:text-danger cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add a skill (e.g. React)..."
                className="h-9 flex-1 rounded-xl border border-border bg-white/[0.03] px-3 text-sm outline-none focus:border-primary/50 transition-colors"
              />
              <button
                onClick={addSkill}
                disabled={!newSkill.trim()}
                className="flex h-9 items-center gap-1 rounded-xl bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 cursor-pointer"
              >
                <Plus className="size-4" /> Add
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Social Links */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
              <Globe className="size-4 text-accent" /> Social Links
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-2 flex items-center gap-1.5">
                  <Github className="size-3.5" /> GitHub
                </label>
                <input
                  value={profile.socials?.github || ""}
                  onChange={(e) => updateSocial("github", e.target.value)}
                  placeholder="https://github.com/..."
                  className="h-9 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-2 flex items-center gap-1.5">
                  <Twitter className="size-3.5" /> Twitter
                </label>
                <input
                  value={profile.socials?.twitter || ""}
                  onChange={(e) => updateSocial("twitter", e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="h-9 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-2 flex items-center gap-1.5">
                  <Linkedin className="size-3.5" /> LinkedIn
                </label>
                <input
                  value={profile.socials?.linkedin || ""}
                  onChange={(e) => updateSocial("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="h-9 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-2 flex items-center gap-1.5">
                  <Globe className="size-3.5" /> Website
                </label>
                <input
                  value={profile.socials?.website || ""}
                  onChange={(e) => updateSocial("website", e.target.value)}
                  placeholder="https://..."
                  className="h-9 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
