"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileManager from "@/components/ProfileManager";
import QualificationsManager from "@/components/QualificationsManager";
import ActivitiesManager from "@/components/ActivitiesManager";
import ProjectsManager from "@/components/ProjectsManager";
import ResumeManager from "@/components/ResumeManager";
import SkillsManager from "@/components/SkillsManager";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "qualifications", label: "Qualifications" },
  { key: "activities", label: "Activities" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "resume", label: "Résumé" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("profile");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ink">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="eyebrow text-safelight">Darkroom</p>
            <h1 className="font-display font-bold text-2xl text-cream">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" target="_blank" className="font-mono text-sm text-cream/70 hover:text-cream">
              View site ↗
            </Link>
            <button onClick={handleLogout} className="font-mono text-sm text-cream/70 hover:text-safelight">
              Log out
            </button>
          </div>
        </div>
      </header>

      <nav className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex flex-wrap gap-1 border-b border-line">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`font-mono text-sm px-4 py-2.5 border-b-2 transition ${
                tab === t.key
                  ? "border-safelight text-cream"
                  : "border-transparent text-cream/50 hover:text-cream/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {tab === "profile" && <ProfileManager />}
        {tab === "qualifications" && <QualificationsManager />}
        {tab === "activities" && <ActivitiesManager />}
        {tab === "projects" && <ProjectsManager />}
        {tab === "resume" && <ResumeManager />}
        {tab === "skills" && <SkillsManager />}
      </div>
    </main>
  );
}
