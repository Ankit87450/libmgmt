import { NextResponse } from "next/server";
import { mutate } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/guard";

type PatchBody = Partial<{
  name: string;
  active: boolean;
  isAdmin: boolean;
  password: string;
}>;

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const body = (await req.json()) as PatchBody;
  const out = await mutate((db) => {
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...body };
    return db.users[idx];
  });
  if (!out) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: out });
}
