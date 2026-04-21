import { NextResponse } from "next/server";
import { addMonths, format } from "date-fns";
import { mutate } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/guard";
import type { MembershipDuration } from "@/lib/types";

function months(d: MembershipDuration): number {
  return d === "6m" ? 6 : d === "1y" ? 12 : 24;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const { extension } = (await req.json()) as { extension: MembershipDuration };
  const out = await mutate((db) => {
    const idx = db.members.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    const m = db.members[idx];
    m.endDate = format(
      addMonths(new Date(m.endDate), months(extension)),
      "yyyy-MM-dd",
    );
    m.status = "Active";
    return m;
  });
  if (!out) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ member: out });
}
