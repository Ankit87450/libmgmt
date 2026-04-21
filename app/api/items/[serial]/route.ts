import { NextResponse } from "next/server";
import { mutate } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/guard";
import type { ItemStatus } from "@/lib/types";

type PatchBody = Partial<{
  status: ItemStatus;
  name: string;
  author: string;
  cost: number;
  procurementDate: string;
}>;

export async function PATCH(
  req: Request,
  context: { params: Promise<{ serial: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { serial } = await context.params;
  const body = (await req.json()) as PatchBody;
  const result = await mutate((db) => {
    const idx = db.items.findIndex((i) => i.serialNo === serial);
    if (idx === -1) return null;
    db.items[idx] = { ...db.items[idx], ...body };
    return db.items[idx];
  });
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: result });
}
