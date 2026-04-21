import { NextResponse } from "next/server";
import { readDb, resetDb } from "@/lib/server/db";
import { requireSession } from "@/lib/server/guard";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const db = readDb();
  // Redact credentials and sessions for safety even in dev viewer.
  const redacted = {
    ...db,
    users: db.users.map((u) => ({ ...u, password: "***" })),
    sessions: db.sessions.map((s) => ({
      token: `${s.token.slice(0, 4)}…`,
      userId: s.userId,
      createdAt: s.createdAt,
    })),
  };
  return NextResponse.json(redacted);
}

// Admin-only dev helper.
export async function DELETE() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  if (!auth.session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  resetDb();
  return NextResponse.json({ ok: true });
}
