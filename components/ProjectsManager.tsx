"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";

type FormState = Omit<Project, "id" | "order" | "techStack" | "impact"> & {
  techStackInput: string;
  impactInput: string; // one result per line
};

type ImageField = "imageUrl" | "architectureImage";

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
  learnings: "",
};

const inputClass =
  "w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight";

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<ImageField | null>(null);
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
      learnings: item.learnings || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // Uploads through the same /api/upload route the profile photo uses.
  async function handleImageUpload(field: ImageField, e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(field);
    setError(null);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      setForm((prev) => ({ ...prev, [field]: data.url }));
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(null);
      input.value = "";
    }
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
        .map((l) => l.trim())
        .filter(Boolean),
      architectureImage: form.architectureImage,
      challenges: form.challenges,
      learnings: form.learnings,
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

  // Plain render helper (not a nested component) so inputs aren't remounted on every keystroke.
  function renderImageInput(field: ImageField, label: string, hint: string) {
    const value = form[field];
    return (
      <div key={field} className="mb-4">
        <label className="block text-xs text-cream/60 mb-1">{label}</label>
        <div className="flex items-center gap-3">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-20 h-12 object-cover border border-line" />
          ) : (
            <div className="w-20 h-12 border border-dashed border-line flex items-center justify-center text-cream/30 text-[10px]">
              None
            </div>
          )}
          <div className="min-w-0">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={(e) => handleImageUpload(field, e)}
              disabled={uploading !== null}
              className="text-xs text-cream/70 max-w-full file:mr-3 file:py-1.5 file:px-3 file:border file:border-line file:bg-ink file:text-cream file:text-xs hover:file:border-safelight file:cursor-pointer disabled:opacity-60"
            />
            {uploading === field && <p className="text-xs text-cream/40 mt-1">Uploading…</p>}
            {value && uploading !== field && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, [field]: "" }))}
                className="block font-mono text-xs text-cream/50 hover:text-safelight mt-1"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-cream/40 mt-1">{hint}</p>
      </div>
    );
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
                <div className="flex gap-3 min-w-0">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="w-16 h-10 object-cover border border-line shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-cream">
                      {item.title} {item.featured && <span className="eyebrow text-safelight ml-2">Featured</span>}
                    </p>
                    <p className="text-cream/60 text-sm mt-1">{item.summary}</p>
                    <p className="text-cream/40 text-xs mt-1 truncate max-w-sm">{item.githubUrl}</p>
                  </div>
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
          className={inputClass}
        />

        <label className="block text-xs text-cream/60 mb-1">Short summary</label>
        <input
          required
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="One sentence — shown on the project card"
          className={inputClass}
        />

        <label className="block text-xs text-cream/60 mb-1">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="Shown under “See more” — add detail the summary doesn't cover"
          className={inputClass}
        />

        <label className="block text-xs text-cream/60 mb-1">Tech stack (comma-separated)</label>
        <input
          value={form.techStackInput}
          onChange={(e) => setForm({ ...form, techStackInput: e.target.value })}
          placeholder="Next.js, TypeScript, Tailwind CSS"
          className={inputClass}
        />

        <label className="block text-xs text-cream/60 mb-1">GitHub URL</label>
        <input
          required
          type="url"
          value={form.githubUrl}
          onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
          placeholder="https://github.com/you/project"
          className={inputClass}
        />

        <label className="block text-xs text-cream/60 mb-1">Live URL (optional)</label>
        <input
          type="url"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
          className={inputClass}
        />

        {renderImageInput(
          "imageUrl",
          "Screenshot (optional)",
          "Shown at the top of the card. 16:9 works best — JPG, PNG, WEBP or GIF, up to 5MB."
        )}

        <label className="block text-xs text-cream/60 mb-1">Impact / results (optional, one per line)</label>
        <textarea
          value={form.impactInput}
          onChange={(e) => setForm({ ...form, impactInput: e.target.value })}
          rows={3}
          placeholder={"Reduced processing time by 75%\nCovered 120+ test cases"}
          className={inputClass}
        />

        {renderImageInput("architectureImage", "Architecture diagram (optional)", "Shown under “See more”.")}

        <label className="block text-xs text-cream/60 mb-1">Challenges (optional)</label>
        <textarea
          value={form.challenges}
          onChange={(e) => setForm({ ...form, challenges: e.target.value })}
          rows={3}
          placeholder="What was hard, and how you solved it"
          className={inputClass}
        />

        <label className="block text-xs text-cream/60 mb-1">What I learned (optional)</label>
        <textarea
          value={form.learnings}
          onChange={(e) => setForm({ ...form, learnings: e.target.value })}
          rows={3}
          placeholder="Skills, tools or lessons you took away"
          className={inputClass}
        />

        <label className="flex items-center gap-2 text-sm text-cream/70 mb-4">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Feature this project
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading !== null}
            className="flex-1 bg-safelight text-white py-2.5 font-medium hover:brightness-110 transition disabled:opacity-60"
          >
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
