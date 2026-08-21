"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

type FormState = Omit<Project, "id" | "order" | "techStack" | "impact"> & {
  techStackInput: string;
  impactInput: string;
};

const emptyForm: FormState = {
  title: "",
  summary: "",
  description: "",
  techStackInput: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  featured: false,
  impactInput: "",
  architectureImage: "",
  challenges: "",
};

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: Project) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      summary: item.summary,
      description: item.description || "",
      techStackInput: item.techStack.join(", "),
      githubUrl: item.githubUrl,
      liveUrl: item.liveUrl || "",
      imageUrl: item.imageUrl || "",
      featured: item.featured,
      impactInput: (item.impact || []).join("\n"),
      architectureImage: item.architectureImage || "",
      challenges: item.challenges || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      title: form.title,
      summary: form.summary,
      description: form.description,
      techStack: form.techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl,
      liveUrl: form.liveUrl,
      imageUrl: form.imageUrl,
      featured: form.featured,
      impact: form.impactInput
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      architectureImage: form.architectureImage,
      challenges: form.challenges,
    };
    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong.");
      return;
    }
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div>
        <h2 className="font-display text-xl text-cream mb-4">Projects</h2>
        {loading ? (
          <p className="text-cream/50 text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-cream/50 text-sm">Nothing here yet — add your first project.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="border border-line p-4 flex justify-between gap-4">
                <div>
                  <p className="font-medium text-cream">
                    {item.title} {item.featured && <span className="eyebrow text-safelight ml-2">Featured</span>}
                  </p>
                  <p className="text-cream/60 text-sm mt-1">{item.summary}</p>
                  <p className="text-cream/40 text-xs mt-1 truncate max-w-sm">{item.githubUrl}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => startEdit(item)} className="font-mono text-xs text-cream/70 hover:text-safelight">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="font-mono text-xs text-cream/70 hover:text-safelight">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border border-line p-5 bg-surface h-fit sticky top-6">
        <h3 className="font-display text-lg text-cream mb-4">
          {editingId ? "Edit project" : "Add project"}
        </h3>
        {error && <p className="text-safelight text-sm mb-3">{error}</p>}

        <label className="block text-xs text-cream/60 mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Short summary</label>
        <input
          required
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="One sentence — shown on the project card"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Tech stack (comma-separated)</label>
        <input
          value={form.techStackInput}
          onChange={(e) => setForm({ ...form, techStackInput: e.target.value })}
          placeholder="Next.js, TypeScript, Tailwind CSS"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />
        <p className="text-cream/30 text-[11px] -mt-2 mb-3">
          Icons resolve automatically from these names — use common names like
          &quot;Next.js&quot;, &quot;PHP&quot;, &quot;MySQL&quot;.
        </p>

        <label className="block text-xs text-cream/60 mb-1">GitHub URL</label>
        <input
          required
          type="url"
          value={form.githubUrl}
          onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          placeholder="https://github.com/you/project"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Live URL (optional)</label>
        <input
          type="url"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <div className="border-t border-line my-4 pt-4">
          <p className="eyebrow text-cream/40 mb-3">Project Depth</p>

          <label className="block text-xs text-cream/60 mb-1">
            Impact / metrics (one per line)
          </label>
          <textarea
            value={form.impactInput}
            onChange={(e) => setForm({ ...form, impactInput: e.target.value })}
            rows={3}
            placeholder={"Reduced processing time by 75%\nHandled 500+ concurrent users"}
            className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
          />

          <label className="block text-xs text-cream/60 mb-1">
            Architecture diagram URL (optional)
          </label>
          <input
            type="url"
            value={form.architectureImage}
            onChange={(e) => setForm({ ...form, architectureImage: e.target.value })}
            placeholder="https://..."
            className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
          />

          <label className="block text-xs text-cream/60 mb-1">
            Challenges &amp; what I learned (optional)
          </label>
          <textarea
            value={form.challenges}
            onChange={(e) => setForm({ ...form, challenges: e.target.value })}
            rows={3}
            placeholder="The trickiest part was..."
            className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-cream/70 mb-4">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Feature this project
        </label>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-safelight text-cream py-2.5 font-medium hover:brightness-110 transition">
            {editingId ? "Save changes" : "Add project"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border border-line px-4 text-cream/70 hover:text-cream transition">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
