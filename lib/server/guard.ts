import { NextResponse } from "next/server";
import { getSessionUser, type SessionUser } from "./session";

export async function requireSession(): Promise<
  { ok: true; session: SessionUser } | { ok: false; response: NextResponse }
> {
  const session = await getSessionUser();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

export async function requireAdmin(): Promise<
  { ok: true; session: SessionUser } | { ok: false; response: NextResponse }
> {
  const base = await requireSession();
  if (!base.ok) return base;
  if (!base.session.user.isAdmin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return base;
}
