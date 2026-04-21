import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readDb } from "@/lib/server/db";
import { createSession, SESSION_COOKIE } from "@/lib/server/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    username?: string;
    password?: string;
    role?: "admin" | "user";
  };
  const username = body.username?.trim();
  const password = body.password ?? "";
  const role = body.role ?? "user";
  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 400 },
    );
  }
  const db = readDb();
  const wantAdmin = role === "admin";
  const match = db.users.find(
    (u) =>
      u.username === username &&
      u.password === password &&
      u.active &&
      u.isAdmin === wantAdmin,
  );
  if (!match) {
    return NextResponse.json(
      { error: "Invalid credentials for the selected role." },
      { status: 401 },
    );
  }
  const token = await createSession(match.id);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return NextResponse.json({
    user: {
      id: match.id,
      name: match.name,
      username: match.username,
      role: match.isAdmin ? "admin" : "user",
    },
  });
}
