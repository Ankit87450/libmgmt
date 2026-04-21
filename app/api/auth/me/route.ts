import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ user: null });
  const u = session.user;
  return NextResponse.json({
    user: {
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.isAdmin ? "admin" : "user",
    },
  });
}
