import { randomBytes, scryptSync } from "node:crypto";
import process from "node:process";
import pg from "pg";

const { Client } = pg;
const ADMIN_USERS_TABLE = "admin_users";
const SCRYPT_KEY_LENGTH = 64;
const ADMIN_USER_ROLES = new Set(["owner", "admin"]);

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

function parseRole(value) {
  if (typeof value !== "string") {
    return "admin";
  }

  const normalizedValue = value.trim().toLowerCase();

  return ADMIN_USER_ROLES.has(normalizedValue) ? normalizedValue : null;
}

async function main() {
  const email = getArgValue("--email");
  const password = getArgValue("--password");
  const role = parseRole(getArgValue("--role"));
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

  if (!role) {
    throw new Error("Pass --role with owner or admin");
  }

  const client = new Client({ connectionString: databaseUrl });

  await client.connect();

  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS ${ADMIN_USERS_TABLE} (
        normalized_email TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`,
    );

    await client.query(
      `ALTER TABLE ${ADMIN_USERS_TABLE}
       ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE`,
    );

    await client.query(
      `UPDATE ${ADMIN_USERS_TABLE}
       SET is_active = TRUE
       WHERE is_active IS NULL`,
    );

    await client.query(
      `ALTER TABLE ${ADMIN_USERS_TABLE}
       ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`,
    );

    await client.query(
      `UPDATE ${ADMIN_USERS_TABLE}
       SET role = 'admin'
       WHERE role IS NULL`,
    );

    await client.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = '${ADMIN_USERS_TABLE}_role_check'
        ) THEN
          ALTER TABLE ${ADMIN_USERS_TABLE}
          ADD CONSTRAINT ${ADMIN_USERS_TABLE}_role_check
          CHECK (role IN ('owner', 'admin'));
        END IF;
      END $$;`,
    );

    const normalizedEmail = normalizeEmail(email);
    const passwordHash = hashPassword(password);
    const existingOwner = await client.query(
      `SELECT normalized_email
       FROM ${ADMIN_USERS_TABLE}
       WHERE role = 'owner'
       LIMIT 1`,
    );

    if (
      role === "owner" &&
      existingOwner.rowCount === 1 &&
      existingOwner.rows[0].normalized_email !== normalizedEmail
    ) {
      throw new Error("An owner already exists; refusing to create a second owner");
    }

    const existingUser = await client.query(
      `SELECT role
       FROM ${ADMIN_USERS_TABLE}
       WHERE normalized_email = $1`,
      [normalizedEmail],
    );

    if (
      role === "admin" &&
      existingUser.rowCount === 1 &&
      existingUser.rows[0].role === "owner"
    ) {
      throw new Error("Refusing to demote the existing owner through this command");
    }

    await client.query(
      `INSERT INTO ${ADMIN_USERS_TABLE} (
        normalized_email,
        email,
        password_hash,
        is_active,
        role
      ) VALUES ($1, $2, $3, TRUE, $4)
      ON CONFLICT (normalized_email) DO UPDATE
        SET email = EXCLUDED.email,
            password_hash = EXCLUDED.password_hash,
            is_active = EXCLUDED.is_active,
            role = EXCLUDED.role`,
      [normalizedEmail, email.trim(), passwordHash, role],
    );

    console.log(`Admin user ready: ${normalizedEmail} (${role})`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
