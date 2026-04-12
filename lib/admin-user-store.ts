import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getDb } from "@/lib/db";

const ADMIN_USERS_TABLE = "admin_users";
const SCRYPT_KEY_LENGTH = 64;
const scrypt = promisify(nodeScrypt);

let adminUsersTablePromise: Promise<void> | null = null;

type AdminUserRow = {
  created_at: string;
  email: string;
  normalized_email: string;
  password_hash: string;
};

export type AdminUserRecord = {
  createdAt: string;
  email: string;
  normalizedEmail: string;
  passwordHash: string;
};

export function normalizeAdminEmail(value: string) {
  return value.trim().toLowerCase();
}

function mapAdminUserRow(row: AdminUserRow): AdminUserRecord {
  return {
    createdAt: row.created_at,
    email: row.email,
    normalizedEmail: row.normalized_email,
    passwordHash: row.password_hash,
  };
}

function getStoredHashParts(passwordHash: string) {
  const [salt, expectedHash] = passwordHash.split(":");

  if (!salt || !expectedHash) {
    return null;
  }

  return {
    expectedHash,
    salt,
  };
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(
    password,
    salt,
    SCRYPT_KEY_LENGTH,
  )) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, passwordHash: string) {
  const parts = getStoredHashParts(passwordHash);

  if (!parts) {
    return false;
  }

  const actualHash = (await scrypt(
    password,
    parts.salt,
    SCRYPT_KEY_LENGTH,
  )) as Buffer;
  const expectedHash = Buffer.from(parts.expectedHash, "hex");

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}

export async function initializeAdminUserStore() {
  if (!adminUsersTablePromise) {
    adminUsersTablePromise = getDb()
      .query(
        `CREATE TABLE IF NOT EXISTS ${ADMIN_USERS_TABLE} (
          normalized_email TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        adminUsersTablePromise = null;
        throw error;
      });
  }

  await adminUsersTablePromise;
}

export async function findAdminUserByNormalizedEmail(
  normalizedEmail: string,
): Promise<AdminUserRecord | null> {
  const result = await getDb().query<AdminUserRow>(
    `SELECT
      normalized_email,
      email,
      password_hash,
      created_at
     FROM ${ADMIN_USERS_TABLE}
     WHERE normalized_email = $1`,
    [normalizedEmail],
  );

  if (result.rowCount !== 1) {
    return null;
  }

  return mapAdminUserRow(result.rows[0]);
}

export async function authenticateAdminUser(
  email: unknown,
  password: unknown,
): Promise<AdminUserRecord | null> {
  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail || !password) {
    return null;
  }

  const adminUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (!adminUser) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, adminUser.passwordHash);

  return passwordMatches ? adminUser : null;
}

export async function upsertAdminUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    throw new Error("Admin email is required");
  }

  if (!password) {
    throw new Error("Admin password is required");
  }

  const passwordHash = await hashPassword(password);
  const result = await getDb().query<AdminUserRow>(
    `INSERT INTO ${ADMIN_USERS_TABLE} (
      normalized_email,
      email,
      password_hash
    ) VALUES ($1, $2, $3)
    ON CONFLICT (normalized_email) DO UPDATE
      SET email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash
    RETURNING
      normalized_email,
      email,
      password_hash,
      created_at`,
    [normalizedEmail, email.trim(), passwordHash],
  );

  return mapAdminUserRow(result.rows[0]);
}
