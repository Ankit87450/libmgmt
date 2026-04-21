import { NextResponse } from "next/server";
import { readDb } from "@/lib/server/db";
import { requireSession } from "@/lib/server/guard";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const db = await readDb();
  return NextResponse.json({ requests: db.requests });
}
