import { NextRequest } from "next/server";
import { listItems, createItem } from "@/lib/crud";

export async function GET() {
  return listItems("skills");
}

export async function POST(request: NextRequest) {
  return createItem("skills", request);
}
