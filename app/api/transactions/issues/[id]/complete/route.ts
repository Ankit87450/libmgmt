import { NextResponse } from "next/server";
import { mutate } from "@/lib/server/db";
import { requireSession } from "@/lib/server/guard";

type PostBody = { finePaid: boolean };

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const { id } = await context.params;
  const body = (await req.json()) as PostBody;
  const out = await mutate((db) => {
    const idx = db.issues.findIndex((i) => i.id === id);
    if (idx === -1) return { error: "Not found" as const };
    const issue = db.issues[idx];
    if (issue.fineCalculated > 0 && !body.finePaid) {
      return { error: "Fine must be paid before completing return" as const };
    }
    issue.finePaid = body.finePaid;
    issue.status = "Returned";
    // Restore item availability.
    const itIdx = db.items.findIndex((i) => i.serialNo === issue.serialNo);
    if (itIdx !== -1) db.items[itIdx].status = "Available";
    // Reset member fine-pending (we treat it as cleared if paid).
    const memIdx = db.members.findIndex((m) => m.id === issue.memberId);
    if (memIdx !== -1) {
      if (body.finePaid) db.members[memIdx].finePending = 0;
      else db.members[memIdx].finePending = issue.fineCalculated;
    }
    return { issue };
  });
  if ("error" in out) {
    const status = out.error === "Not found" ? 404 : 400;
    return NextResponse.json({ error: out.error }, { status });
  }
  return NextResponse.json({ issue: out.issue });
}
