import fs from "node:fs";
import path from "node:path";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

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

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(seedDb(), null, 2), "utf8");
  }
}

// Simple in-process serialization — sufficient for single-node dev server.
let writeChain: Promise<void> = Promise.resolve();

export function readDb(): DbShape {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(raw) as DbShape;
}

export function writeDb(db: DbShape): void {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function mutate<T>(fn: (db: DbShape) => T): Promise<T> {
  let result!: T;
  writeChain = writeChain.then(() => {
    const db = readDb();
    result = fn(db);
    writeDb(db);
  });
  await writeChain;
  return result;
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

export function resetDb(): void {
  writeDb(seedDb());
}
