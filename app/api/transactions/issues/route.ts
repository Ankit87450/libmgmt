import { NextResponse } from "next/server";
import { mutate, nextId, readDb } from "@/lib/server/db";
import { requireSession } from "@/lib/server/guard";
import type { Issue } from "@/lib/types";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const db = readDb();
  return NextResponse.json({ issues: db.issues });
}

type PostBody = {
  serialNo: string;
  memberId: string;
  issueDate: string;
  returnDueDate: string;
  remarks?: string;
};

export async function POST(req: Request) {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const body = (await req.json()) as PostBody;
  const result = await mutate((db) => {
    const item = db.items.find((i) => i.serialNo === body.serialNo);
    if (!item) return { error: "Item not found" as const };
    if (item.status !== "Available")
      return { error: "Item is not available" as const };
    const id = nextId(
      "I",
      db.issues.map((i) => i.id),
    );
    const issue: Issue = {
      id,
      itemId: body.serialNo,
      serialNo: body.serialNo,
      memberId: body.memberId,
      issueDate: body.issueDate,
      returnDueDate: body.returnDueDate,
      remarks: body.remarks,
      fineCalculated: 0,
      finePaid: false,
      status: "Active",
    };
    db.issues.push(issue);
    item.status = "Unavailable";
    return { issue };
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ issue: result.issue }, { status: 201 });
}
