import { NextRequest, NextResponse } from "next/server";
import { getData, updateData } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getData();
  return NextResponse.json(data.profile);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const data = await updateData((current) => ({ ...current, profile: body }));
  return NextResponse.json(data.profile);
}
