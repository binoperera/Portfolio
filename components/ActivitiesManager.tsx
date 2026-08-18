"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/lib/types";

const emptyForm: Omit<Activity, "id" | "order"> = {
  category: "",
  title: "",
  description: "",
  imageUrl: "",
  link: "",
};

export default function ActivitiesManager() {
  const [items, setItems] = useState<Activity[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/activities");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: Activity) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      link: item.link || "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const url = editingId ? `/api/activities/${editingId}` : "/api/activities";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    if (!confirm("Delete this activity?")) return;
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div>
        <h2 className="font-display text-xl text-cream mb-4">
          Photography, design &amp; other activities
        </h2>
        {loading ? (
          <p className="text-cream/50 text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-cream/50 text-sm">Nothing here yet — add your first activity.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="border border-line p-4 flex justify-between gap-4">
                <div>
                  <p className="eyebrow text-aperture">{item.category}</p>
                  <p className="font-medium text-cream">{item.title}</p>
                  {item.link && <p className="text-cream/50 text-xs mt-1 truncate max-w-xs">{item.link}</p>}
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
          {editingId ? "Edit activity" : "Add activity"}
        </h3>
        {error && <p className="text-safelight text-sm mb-3">{error}</p>}

        <label className="block text-xs text-cream/60 mb-1">Category</label>
        <input
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Photography / Graphic Design / Volunteering"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Description (optional)</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Image URL (optional)</label>
        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://…"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Link (optional)</label>
        <input
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://instagram.com/…"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-4 outline-none focus:border-safelight"
        />

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-safelight text-cream py-2.5 font-medium hover:brightness-110 transition">
            {editingId ? "Save changes" : "Add activity"}
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
