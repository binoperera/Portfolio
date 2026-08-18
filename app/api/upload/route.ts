import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, or GIF images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image must be smaller than 5MB." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;

  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
