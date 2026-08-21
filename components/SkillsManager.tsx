"use client";

import { useEffect, useState } from "react";
import type { Skill } from "@/lib/types";

type FormState = Omit<Skill, "id" | "order" | "items"> & {
  itemsInput: string;
};

const emptyForm: FormState = {
  category: "",
  itemsInput: "",
};

export default function SkillsManager() {
  const [items, setItems] = useState<Skill[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/skills");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: Skill) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      itemsInput: item.items.join(", "),
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
      category: form.category,
      items: form.itemsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
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
    if (!confirm("Delete this skill category?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div>
        <h2 className="font-display text-xl text-cream mb-4">Skills</h2>
        {loading ? (
          <p className="text-cream/50 text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-cream/50 text-sm">Nothing here yet — add your first skill category.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="border border-line p-4 flex justify-between gap-4">
                <div>
                  <p className="font-medium text-cream">{item.category}</p>
                  <p className="text-cream/60 text-sm mt-1">{item.items.join(", ")}</p>
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
          {editingId ? "Edit skill category" : "Add skill category"}
        </h3>
        {error && <p className="text-safelight text-sm mb-3">{error}</p>}

        <label className="block text-xs text-cream/60 mb-1">Category</label>
        <input
          required
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Languages, Frameworks, Databases, Tools, Testing..."
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Skills (comma-separated)</label>
        <textarea
          required
          value={form.itemsInput}
          onChange={(e) => setForm({ ...form, itemsInput: e.target.value })}
          rows={3}
          placeholder="JavaScript, TypeScript, PHP"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-safelight text-cream py-2.5 font-medium hover:brightness-110 transition">
            {editingId ? "Save changes" : "Add category"}
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
