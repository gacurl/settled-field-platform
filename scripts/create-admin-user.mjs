import { randomBytes, scryptSync } from "node:crypto";
import process from "node:process";
import pg from "pg";

const { Client } = pg;
const ADMIN_USERS_TABLE = "admin_users";
const SCRYPT_KEY_LENGTH = 64;

function getArgValue(flag) {
  const flagIndex = process.argv.indexOf(flag);

  if (flagIndex === -1) {
    return null;
  }

  return process.argv[flagIndex + 1] ?? null;
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH);

  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const email = getArgValue("--email");
  const password = getArgValue("--password");
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!email || !normalizeEmail(email)) {
    throw new Error("Pass --email with a valid admin email");
  }

  if (!password) {
    throw new Error("Pass --password with a non-empty admin password");
  }

  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS ${ADMIN_USERS_TABLE} (
        normalized_email TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    );

    const normalizedEmail = normalizeEmail(email);
    const passwordHash = hashPassword(password);

    await client.query(
      `INSERT INTO ${ADMIN_USERS_TABLE} (
        normalized_email,
        email,
        password_hash
      ) VALUES ($1, $2, $3)
      ON CONFLICT (normalized_email) DO UPDATE
        SET email = EXCLUDED.email,
            password_hash = EXCLUDED.password_hash`,
      [normalizedEmail, email.trim(), passwordHash],
    );

    console.log(`Admin user ready: ${normalizedEmail}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
