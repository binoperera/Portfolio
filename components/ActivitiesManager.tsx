"use client";

import { useEffect, useRef, useState } from "react";
import type { Activity } from "@/lib/types";

// Vercel rejects request bodies over 4.5MB, so large camera photos are resized
// in the browser before upload. 2000px on the long edge is plenty for the gallery
// (tiles are ~300px; clicking opens the full image).
const MAX_EDGE = 2000;
const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;

async function shrinkImage(file: File): Promise<File> {
  // GIFs would lose animation on a canvas; small files don't need it.
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode(); // <img> respects EXIF rotation, so phone photos stay upright
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1 && file.size <= MAX_UPLOAD_BYTES) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    if (!blob) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Same endpoint ProfileManager uses: POST /api/upload → { url }.
async function uploadImage(file: File): Promise<string> {
  const ready = await shrinkImage(file);
  if (ready.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name}: still too large after resizing.`);
  }
  const body = new FormData();
  body.append("file", ready);
  const res = await fetch("/api/upload", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(`${file.name}: ${data.error || "upload failed."}`);
  }
  return data.url;
}

const emptyForm: Omit<Activity, "id" | "order"> = {
  category: "",
  title: "",
  description: "",
  imageUrl: "",
  link: "",
};

// Same file-input styling as ProfileManager.
const FILE_INPUT =
  "text-xs text-cream/70 file:mr-3 file:py-1.5 file:px-3 file:border file:border-line file:bg-ink file:text-cream file:text-xs hover:file:border-safelight file:cursor-pointer disabled:opacity-60";

// Gallery URLs are edited as plain text (one per line) and only parsed on save,
// so pressing Enter in the textarea isn't swallowed while typing.
function parseImageList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ActivitiesManager() {
  const [items, setItems] = useState<Activity[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imagesText, setImagesText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const uploading = uploadStatus !== null;

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadStatus("Uploading cover…");
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadStatus(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  // One at a time, so a failed photo doesn't stop the rest and progress is clear.
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    const failures: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadStatus(`Uploading ${i + 1} of ${files.length}…`);
      try {
        const url = await uploadImage(files[i]);
        setImagesText((t) => (t.trim() ? `${t.trimEnd()}\n${url}` : url));
      } catch (err) {
        failures.push(err instanceof Error ? err.message : `${files[i].name}: upload failed.`);
      }
    }
    if (failures.length) setError(failures.join(" "));
    setUploadStatus(null);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  function removeGalleryImage(index: number) {
    setImagesText(parseImageList(imagesText).filter((_, i) => i !== index).join("\n"));
  }

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
    setImagesText((item.images ?? []).join("\n"));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImagesText("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const url = editingId ? `/api/activities/${editingId}` : "/api/activities";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: parseImageList(imagesText) }),
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

  const galleryPreview = parseImageList(imagesText);

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
                  {item.images && item.images.length > 0 && (
                    <p className="font-mono text-xs text-cream/50 mt-1">
                      {item.images.length} gallery photo{item.images.length === 1 ? "" : "s"}
                    </p>
                  )}
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
        {uploadStatus && <p className="text-cream/50 text-xs mb-3">{uploadStatus}</p>}

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

        <label className="block text-xs text-cream/60 mb-1">Cover image (optional)</label>
        <div className="flex items-center gap-3 mb-2">
          {form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="Cover preview" className="w-14 h-10 object-cover border border-line" />
          ) : (
            <div className="w-14 h-10 border border-dashed border-line" />
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleCoverUpload}
            disabled={uploading}
            className={FILE_INPUT}
          />
        </div>
        <input
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="…or paste a URL"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-3 outline-none focus:border-safelight"
        />

        <label className="block text-xs text-cream/60 mb-1">Gallery photos (optional)</label>
        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleGalleryUpload}
          disabled={uploading}
          className={`${FILE_INPUT} mb-2`}
        />
        {galleryPreview.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-2">
            {galleryPreview.map((src, i) => (
              <li key={`${src}-${i}`} className="relative w-12 h-12 border border-line bg-ink overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute top-0 right-0 w-4 h-4 bg-ink/80 text-cream text-[10px] leading-none hover:bg-safelight"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <textarea
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={3}
          placeholder={"…or paste URLs, one per line"}
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-1 outline-none focus:border-safelight font-mono text-xs"
        />
        <p className="text-xs text-cream/40 mb-3">
          JPG, PNG, WEBP or GIF. Large photos are resized to 2000px before upload.
        </p>

        <label className="block text-xs text-cream/60 mb-1">Link (optional)</label>
        <input
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://instagram.com/…"
          className="w-full bg-ink border border-line text-cream px-3 py-2 mb-4 outline-none focus:border-safelight"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-safelight text-cream py-2.5 font-medium hover:brightness-110 transition disabled:opacity-60"
          >
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
