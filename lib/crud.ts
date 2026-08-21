import { NextRequest, NextResponse } from "next/server";
import { getData, updateData } from "./store";
import { PortfolioData } from "./types";

type CollectionKey = "qualifications" | "activities" | "projects" | "skills";

function generateId() {
  return crypto.randomUUID().slice(0, 8);
}

export async function listItems(key: CollectionKey) {
  const data = await getData();
  const items = [...(data[key] as any[])].sort((a, b) => a.order - b.order);
  return NextResponse.json(items);
}

export async function createItem(key: CollectionKey, request: NextRequest) {
  const body = await request.json();
  const data = await updateData((current) => {
    const items = current[key] as any[];
    const newItem = {
      ...body,
      id: generateId(),
      order: body.order ?? items.length + 1,
    };
    return { ...current, [key]: [...items, newItem] } as PortfolioData;
  });
  const items = data[key] as any[];
  return NextResponse.json(items[items.length - 1], { status: 201 });
}

export async function updateItem(key: CollectionKey, id: string, request: NextRequest) {
  const body = await request.json();
  let updated: any = null;
  await updateData((current) => {
    const items = (current[key] as any[]).map((item) => {
      if (item.id === id) {
        updated = { ...item, ...body, id };
        return updated;
      }
      return item;
    });
    return { ...current, [key]: items } as PortfolioData;
  });

  if (!updated) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function deleteItem(key: CollectionKey, id: string) {
  let existed = false;
  await updateData((current) => {
    const items = current[key] as any[];
    existed = items.some((item) => item.id === id);
    return { ...current, [key]: items.filter((item) => item.id !== id) } as PortfolioData;
  });

  if (!existed) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
