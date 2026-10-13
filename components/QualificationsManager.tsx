"use client";

import { useEffect, useState } from "react";
import type { Qualification } from "@/lib/types";

const emptyForm: Omit<Qualification, "id"> = {
  type: "education",
  title: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  order: 0,
};

export default function QualificationsManager() {
  const [items, setItems] = useState<Qualification[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/qualifications");
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: Qualification) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      title: item.title,
      organization: item.organization,
      location: item.location || "",
      startDate: item.startDate,
      endDate: item.endDate || "",
      description: item.description || "",
      order: item.order ?? 0,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const url = editingId
      ? `/api/qualifications/${editingId}`
      : "/api/qualifications";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
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
    if (!confirm("Delete this entry?")) return;

    await fetch(`/api/qualifications/${id}`, {
      method: "DELETE",
    });

    if (editingId === id) resetForm();

    load();
  }

  // ==========================
  // Sort order (mirrors the live site)
  // ==========================
  const typeOrder: Record<Qualification["type"], number> = {
    education: 0,
    experience: 1,
    certification: 2,
  };

  function byRecency(a: Qualification, b: Qualification) {
    // Present (no endDate) counts as the latest possible date
    const endA = a.endDate || "9999-12";
    const endB = b.endDate || "9999-12";
    if (endA !== endB) return endB.localeCompare(endA); // latest end date first
    // Tiebreaker when end dates match: latest start date first
    return b.startDate.localeCompare(a.startDate);
  }

  const sortedItems = [...items].sort((a, b) => {
    // Education -> Experience -> Certification
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[a.type] - typeOrder[b.type];
    }
    // Certifications: your chosen order first, then newest first
    if (a.type === "certification") {
      return (a.order ?? 0) - (b.order ?? 0) || byRecency(a, b);
    }
    return byRecency(a, b);
  });

  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
      <div>
        <h2 className="font-display text-2xl text-cream mb-6">
          Education, Experience & Certifications
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : sortedItems.length === 0 ? (
          <p>Nothing here yet — add your first entry.</p>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="border border-line bg-surface p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-cream/60">
                      {item.type}
                      {item.type === "certification" && (
                        <span className="ml-2 text-safelight">#{item.order ?? 0}</span>
                      )}
                    </span>

                    <h3 className="text-lg font-semibold text-cream mt-1">
                      {item.title}
                    </h3>

                    <p className="text-cream/70 mt-1">
                      {item.organization}
                      {item.location && ` • ${item.location}`}
                    </p>

                    <p className="text-sm text-cream/50 mt-1">
                      {item.startDate} — {item.endDate || "Present"}
                    </p>

                    {item.description && (
                      <p className="text-cream/70 mt-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(item)}
                      className="font-mono text-xs text-cream/70 hover:text-safelight"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="font-mono text-xs text-cream/70 hover:text-safelight"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-line p-5 bg-surface h-fit sticky top-6"
      >
        <h3 className="font-display text-lg text-cream mb-4">
          {editingId ? "Edit entry" : "Add entry"}
        </h3>

        {error && (
          <p className="text-safelight text-sm mb-3">{error}</p>
        )}

        <label className="block text-xs text-cream/60 mb-1">
          Type
        </label>

        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as Qualification["type"],
            })
          }
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        >
          <option value="education">Education</option>
          <option value="experience">Experience</option>
          <option value="certification">Certification</option>
        </select>

        <label className="block text-xs text-cream/60 mb-1">
          Title
        </label>

        <input
          required
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          placeholder="BSc in Software Engineering"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">
          Organization
        </label>

        <input
          required
          value={form.organization}
          onChange={(e) =>
            setForm({ ...form, organization: e.target.value })
          }
          placeholder="University / Company"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">
          Location (optional)
        </label>

        <input
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-cream/60 mb-1">
              Start (YYYY-MM)
            </label>

            <input
              required
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
              placeholder="2022-01"
              className="w-full bg-ink border border-line text-cream px-3 py-2 outline-none focus:border-safelight"
            />
          </div>

          <div>
            <label className="block text-xs text-cream/60 mb-1">
              End (blank = Present)
            </label>

            <input
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
              placeholder="2025-06"
              className="w-full bg-ink border border-line text-cream px-3 py-2 outline-none focus:border-safelight"
            />
          </div>
        </div>

        {form.type === "certification" && (
          <>
            <label className="block text-xs text-cream/60 mb-1">
              Display order (1 = shown first)
            </label>

            <input
              type="number"
              min={0}
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) || 0 })
              }
              className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
            />
          </>
        )}

        <label className="block text-xs text-cream/60 mb-1">
          Description (optional)
        </label>

        <textarea
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-4 outline-none focus:border-safelight"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-safelight text-white py-2.5 font-medium hover:brightness-110 transition"
          >
            {editingId ? "Save changes" : "Add entry"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-line px-4 text-cream/70 hover:text-cream transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
