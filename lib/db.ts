import { Pool } from "pg";

declare global {
  // Reuse the pool during local module reloads.
  var __dbPool__: Pool | undefined;
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  return databaseUrl;
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
  });
}

export function getDb() {
  if (!globalThis.__dbPool__) {
    globalThis.__dbPool__ = createPool();
  }

  return globalThis.__dbPool__;
}

export async function testDatabaseConnection() {
  const client = await getDb().connect();

  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}
