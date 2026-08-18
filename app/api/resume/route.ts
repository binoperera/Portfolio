import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getData, updateData } from "@/lib/store";

const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const data = await getData();
  return NextResponse.json(data.resume);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file was attached." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
  }
  const MAX_SIZE = 8 * 1024 * 1024; // 8MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is larger than 8MB." }, { status: 400 });
  }

  const safeName = `resume-${Date.now()}.pdf`;
  let url: string;

  if (hasBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(safeName, file, {
      access: "public",
      contentType: "application/pdf",
    });
    url = blob.url;
  } else {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(UPLOAD_DIR, safeName), buffer);
    url = `/uploads/${safeName}`;
  }

  const resumeMeta = {
    fileName: file.name,
    url,
    uploadedAt: new Date().toISOString(),
    size: file.size,
  };

  await updateData((current) => ({ ...current, resume: resumeMeta }));
  return NextResponse.json(resumeMeta, { status: 201 });
}

export async function DELETE() {
  const data = await getData();
  const current = data.resume;

  if (current) {
    if (hasBlob && current.url.includes("blob.vercel-storage.com")) {
      const { del } = await import("@vercel/blob");
      await del(current.url);
    } else if (!hasBlob) {
      const localPath = path.join(process.cwd(), "public", current.url.replace(/^\//, ""));
      fs.rm(localPath, () => {});
    }
  }

  await updateData((c) => ({ ...c, resume: null }));
  return NextResponse.json({ ok: true });
}
