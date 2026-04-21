import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __lmsPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __lmsSchemaReady: Promise<void> | undefined;
}

function makePool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Put it in .env or your deployment env vars.",
    );
  }
  // Supabase direct connections present a self-signed-style chain; accept it.
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

export const pool: Pool = (globalThis.__lmsPgPool ??= makePool());
