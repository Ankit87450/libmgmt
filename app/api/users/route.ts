import { NextResponse } from "next/server";
import { mutate, nextId, readDb } from "@/lib/server/db";
import { requireAdmin } from "@/lib/server/guard";
import type { AppUser } from "@/lib/types";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const db = readDb();
  return NextResponse.json({ users: db.users });
}

type AddBody = {
  name: string;
  active: boolean;
  isAdmin: boolean;
};

function deriveUsername(name: string, existing: string[]): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
  if (!base) return "user";
  if (!existing.includes(base)) return base;
  let n = 2;
  while (existing.includes(`${base}${n}`)) n++;
  return `${base}${n}`;
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const body = (await req.json()) as AddBody;
  if (!body.name || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const created = await mutate((db) => {
    const id = nextId(
      "U",
      db.users.map((u) => u.id),
    );
    const username = deriveUsername(
      body.name,
      db.users.map((u) => u.username),
    );
    const first = body.name.trim().split(/\s+/)[0].toLowerCase() || "pass";
    const u: AppUser = {
      id,
      name: body.name.trim(),
      active: Boolean(body.active),
      isAdmin: Boolean(body.isAdmin),
      username,
      password: first,
    };
    db.users.push(u);
    return u;
  });
  return NextResponse.json({ user: created }, { status: 201 });
}
