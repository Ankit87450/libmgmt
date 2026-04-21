import { NextResponse } from "next/server";
import { mutate } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/guard";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const out = await mutate((db) => {
    const idx = db.members.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    db.members[idx].status = "Inactive";
    return db.members[idx];
  });
  if (!out) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ member: out });
}
