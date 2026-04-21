import { NextResponse } from "next/server";
import { mutate } from "@/lib/server/db";
import { requireSession } from "@/lib/server/guard";
import { differenceInCalendarDays } from "date-fns";

type PostBody = {
  actualReturnDate: string;
  remarks?: string;
};

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
    if (idx === -1) return null;
    const issue = db.issues[idx];
    const overdueDays = Math.max(
      0,
      differenceInCalendarDays(
        new Date(body.actualReturnDate),
        new Date(issue.returnDueDate),
      ),
    );
    issue.actualReturnDate = body.actualReturnDate;
    issue.remarks = body.remarks;
    issue.fineCalculated = overdueDays * db.settings.finePerDay;
    return issue;
  });
  if (!out) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ issue: out });
}
