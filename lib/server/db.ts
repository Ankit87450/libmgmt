import { randomUUID } from "node:crypto";
import {
  seedAppUsers,
  seedIssues,
  seedItems,
  seedMembers,
  seedRequests,
} from "@/lib/seed";
import type {
  AppUser,
  Issue,
  IssueRequest,
  Item,
  Member,
} from "@/lib/types";
import { pool } from "./pool";

export type Session = { token: string; userId: string; createdAt: number };

export type Settings = { finePerDay: number };

export type DbShape = {
  version: 1;
  settings: Settings;
  items: Item[];
  members: Member[];
  users: AppUser[];
  issues: Issue[];
  requests: IssueRequest[];
  sessions: Session[];
};

function seedDb(): DbShape {
  return {
    version: 1,
    settings: { finePerDay: 10 },
    items: seedItems,
    members: seedMembers,
    users: seedAppUsers,
    issues: seedIssues,
    requests: seedRequests,
    sessions: [],
  };
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS libmgmt_state (
  id    INT PRIMARY KEY,
  data  JSONB NOT NULL
);
`;

async function ensureSchema(): Promise<void> {
  if (globalThis.__lmsSchemaReady) return globalThis.__lmsSchemaReady;
  globalThis.__lmsSchemaReady = (async () => {
    await pool.query(SCHEMA_SQL);
    const { rows } = await pool.query(
      "SELECT 1 FROM libmgmt_state WHERE id = 1",
    );
    if (rows.length === 0) {
      await pool.query(
        "INSERT INTO libmgmt_state (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING",
        [seedDb()],
      );
    }
  })().catch((err) => {
    // Allow retry on next call if schema init failed.
    globalThis.__lmsSchemaReady = undefined;
    throw err;
  });
  return globalThis.__lmsSchemaReady;
}

export async function readDb(): Promise<DbShape> {
  await ensureSchema();
  const { rows } = await pool.query<{ data: DbShape }>(
    "SELECT data FROM libmgmt_state WHERE id = 1",
  );
  return rows[0].data;
}

export async function writeDb(db: DbShape): Promise<void> {
  await ensureSchema();
  await pool.query("UPDATE libmgmt_state SET data = $1 WHERE id = 1", [db]);
}

export async function mutate<T>(fn: (db: DbShape) => T): Promise<T> {
  await ensureSchema();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ data: DbShape }>(
      "SELECT data FROM libmgmt_state WHERE id = 1 FOR UPDATE",
    );
    const db = rows[0].data;
    const result = fn(db);
    await client.query("UPDATE libmgmt_state SET data = $1 WHERE id = 1", [
      db,
    ]);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw err;
  } finally {
    client.release();
  }
}

export function nextId(prefix: string, existing: string[]): string {
  let max = 0;
  const re = new RegExp(`^${prefix}(\\d+)$`);
  for (const id of existing) {
    const m = id.match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export function newSessionToken(): string {
  return randomUUID();
}

export async function resetDb(): Promise<void> {
  await ensureSchema();
  await pool.query("UPDATE libmgmt_state SET data = $1 WHERE id = 1", [
    seedDb(),
  ]);
}
