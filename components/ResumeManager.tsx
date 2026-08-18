"use client";

import { useEffect, useRef, useState } from "react";
import type { ResumeMeta } from "@/lib/types";

export default function ResumeManager() {
  const [resume, setResume] = useState<ResumeMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/resume");
    setResume(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const file = fileInput.current?.files?.[0];
    if (!file) {
      setError("Choose a PDF file first.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/resume", { method: "POST", body: formData });
    setUploading(false);
    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Upload failed.");
      return;
    }
    if (fileInput.current) fileInput.current.value = "";
    load();
  }

  async function handleDelete() {
    if (!confirm("Remove the current résumé?")) return;
    await fetch("/api/resume", { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-xl text-cream mb-4">Résumé</h2>

      {loading ? (
        <p className="text-cream/50 text-sm">Loading…</p>
      ) : resume ? (
        <div className="border border-line p-5 bg-surface mb-6">
          <p className="text-cream font-medium">{resume.fileName}</p>
          <p className="text-cream/50 text-xs font-mono mt-1">
            Uploaded {new Date(resume.uploadedAt).toLocaleString()} · {(resume.size / 1024).toFixed(0)} KB
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href={resume.url}
              download={resume.fileName}
              className="font-mono text-sm text-aperture hover:brightness-110"
            >
              Download current file
            </a>
            <button onClick={handleDelete} className="font-mono text-sm text-cream/60 hover:text-safelight">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <p className="text-cream/50 text-sm mb-6">
          No résumé uploaded yet. Visitors won't see a download button until you add one.
        </p>
      )}

      <form onSubmit={handleUpload} className="border border-line p-5 bg-surface">
        <label className="block text-xs text-cream/60 mb-2">
          Upload a new PDF {resume ? "(replaces the current one)" : ""}
        </label>
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          className="w-full text-cream/80 text-sm mb-4 file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-line file:text-cream"
        />
        {error && <p className="text-safelight text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="bg-safelight text-cream px-5 py-2.5 font-medium hover:brightness-110 transition disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload résumé"}
        </button>
      </form>
    </div>
  );
}
