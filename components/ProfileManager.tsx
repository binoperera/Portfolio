"use client";

import { useEffect, useRef, useState } from "react";
import type { Profile } from "@/lib/types";

export default function ProfileManager() {
  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setForm);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setSavedMsg(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Something went wrong.");
      return;
    }
    setSavedMsg("Saved.");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form) return;

    setUploading(true);
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
      setForm({ ...form, photoUrl: data.url });
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!form) return <p className="text-cream/50 text-sm">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl border border-line p-6 bg-surface">
      <h2 className="font-display text-xl text-cream mb-5">Profile &amp; hero content</h2>
      {error && <p className="text-safelight text-sm mb-3">{error}</p>}
      {savedMsg && <p className="text-aperture text-sm mb-3">{savedMsg}</p>}

      <label className="block text-xs text-cream/60 mb-1">Full name</label>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
      />

      <label className="block text-xs text-cream/60 mb-1">Role / title</label>
      <input
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
      />

      <label className="block text-xs text-cream/60 mb-1">Tagline (hero subtext)</label>
      <textarea
        rows={2}
        value={form.tagline}
        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
      />

      <label className="block text-xs text-cream/60 mb-1">Bio (About section)</label>
      <textarea
        rows={4}
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-cream/60 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-ink border border-line text-cream px-3 py-2 outline-none focus:border-safelight"
          />
        </div>
        <div>
          <label className="block text-xs text-cream/60 mb-1">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full bg-ink border border-line text-cream px-3 py-2 outline-none focus:border-safelight"
          />
        </div>
      </div>

      <label className="block text-xs text-cream/60 mb-1">Profile photo</label>
      <div className="flex items-center gap-3 mb-1">
        {form.photoUrl ? (
          <img
            src={form.photoUrl}
            alt="Profile preview"
            className="w-14 h-14 object-cover border border-line"
          />
        ) : (
          <div className="w-14 h-14 border border-dashed border-line flex items-center justify-center text-cream/30 text-[10px]">
            No photo
          </div>
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-xs text-cream/70 file:mr-3 file:py-1.5 file:px-3 file:border file:border-line file:bg-ink file:text-cream file:text-xs hover:file:border-safelight file:cursor-pointer disabled:opacity-60"
          />
          {uploading && <p className="text-xs text-cream/40 mt-1">Uploading…</p>}
        </div>
      </div>
      <p className="text-xs text-cream/40 mb-4">
        JPG, PNG, WEBP, or GIF — up to 5MB.
      </p>

      <p className="text-xs text-cream/60 mb-2 mt-4">Social links (optional)</p>
      {(["GitHub", "Linkedin", "Instagram", "Facebook"] as const).map((key) => (
        <input
          key={key}
          value={form.socials[key] || ""}
          onChange={(e) => setForm({ ...form, socials: { ...form.socials, [key]: e.target.value } })}
          placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />
      ))}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-safelight text-cream px-5 py-2.5 font-medium hover:brightness-110 transition disabled:opacity-60 mt-2"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}