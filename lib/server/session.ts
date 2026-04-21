import { cookies } from "next/headers";
import { mutate, newSessionToken, readDb } from "./db";
import type { AppUser } from "@/lib/types";
import { SESSION_COOKIE } from "@/lib/auth-constants";

export { SESSION_COOKIE };
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8h

export type SessionUser = {
  token: string;
  user: AppUser;
};

export async function createSession(userId: string): Promise<string> {
  const token = newSessionToken();
  await mutate((db) => {
    const now = Date.now();
    db.sessions = db.sessions
      .filter((s) => now - s.createdAt < SESSION_TTL_MS)
      .filter((s) => s.userId !== userId);
    db.sessions.push({ token, userId, createdAt: now });
  });
  return token;
}

export async function destroySession(token: string): Promise<void> {
  await mutate((db) => {
    db.sessions = db.sessions.filter((s) => s.token !== token);
  });
}

export function lookupSession(token: string): SessionUser | null {
  if (!token) return null;
  const db = readDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) return null;
  const user = db.users.find((u) => u.id === session.userId);
  if (!user || !user.active) return null;
  return { token, user };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value ?? "";
  return lookupSession(token);
}
