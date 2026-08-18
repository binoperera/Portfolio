import { NextRequest } from "next/server";
import { listItems, createItem } from "@/lib/crud";

export async function GET() {
  return listItems("activities");
}

export async function POST(request: NextRequest) {
  return createItem("activities", request);
}
