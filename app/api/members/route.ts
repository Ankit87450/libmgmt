import { NextResponse } from "next/server";
import { addMonths, format } from "date-fns";
import { mutate, nextId, readDb } from "@/lib/server/db";
import { requireAdmin, requireSession } from "@/lib/server/guard";
import type { Member, MembershipDuration } from "@/lib/types";

function months(d: MembershipDuration): number {
  return d === "6m" ? 6 : d === "1y" ? 12 : 24;
}

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const db = await readDb();
  return NextResponse.json({ members: db.members });
}

type AddBody = {
  firstName: string;
  lastName: string;
  contactNumber: string;
  contactAddress: string;
  aadhaar: string;
  startDate: string;
  duration: MembershipDuration;
};

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const body = (await req.json()) as AddBody;
  const created = await mutate((db) => {
    const id = nextId(
      "M",
      db.members.map((m) => m.id),
    );
    const endDate = format(
      addMonths(new Date(body.startDate), months(body.duration)),
      "yyyy-MM-dd",
    );
    const m: Member = {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      contactNumber: body.contactNumber,
      contactAddress: body.contactAddress,
      aadhaar: body.aadhaar,
      startDate: body.startDate,
      endDate,
      duration: body.duration,
      status: "Active",
      finePending: 0,
    };
    db.members.push(m);
    return m;
  });
  return NextResponse.json({ member: created }, { status: 201 });
}
