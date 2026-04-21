import { NextResponse } from "next/server";
import { mutate, readDb } from "@/lib/server/db";
import { requireAdmin, requireSession } from "@/lib/server/guard";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const db = readDb();
  return NextResponse.json({ settings: db.settings });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const body = (await req.json()) as Partial<{ finePerDay: number }>;
  const out = await mutate((db) => {
    if (typeof body.finePerDay === "number" && body.finePerDay >= 0) {
      db.settings.finePerDay = body.finePerDay;
    }
    return db.settings;
  });
  return NextResponse.json({ settings: out });
}
