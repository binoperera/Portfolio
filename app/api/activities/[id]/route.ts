import { NextRequest } from "next/server";
import { updateItem, deleteItem } from "@/lib/crud";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return updateItem("activities", params.id, request);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return deleteItem("activities", params.id);
}
