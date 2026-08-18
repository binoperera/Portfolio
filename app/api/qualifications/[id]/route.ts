import { NextRequest } from "next/server";
import { updateItem, deleteItem } from "@/lib/crud";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return updateItem("qualifications", params.id, request);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  return deleteItem("qualifications", params.id);
}
