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
  role: string;
};

export const ADMIN_USER_ROLES = ["owner", "admin"] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];

export type AdminUserRecord = {
  createdAt: string;
  email: string;
  normalizedEmail: string;
  passwordHash: string;
  role: AdminUserRole;
};

export function normalizeAdminEmail(value: string) {
  return value.trim().toLowerCase();
}

function mapAdminUserRow(row: AdminUserRow): AdminUserRecord {
  const role = parseAdminUserRole(row.role);

  if (!role) {
    throw new Error(`Invalid admin user role for ${row.normalized_email}`);
  }

  return {
    createdAt: row.created_at,
    email: row.email,
    normalizedEmail: row.normalized_email,
    passwordHash: row.password_hash,
    role,
  };
}

export function parseAdminUserRole(value: unknown): AdminUserRole | null {
  if (typeof value !== "string") {
    return null;
  }

  return ADMIN_USER_ROLES.find((role) => role === value) ?? null;
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
      .query(`CREATE TABLE IF NOT EXISTS ${ADMIN_USERS_TABLE} (
        normalized_email TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`)
      .then(() =>
        getDb().query(
          `ALTER TABLE ${ADMIN_USERS_TABLE}
           ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`,
        ),
      )
      .then(() =>
        getDb().query(
          `UPDATE ${ADMIN_USERS_TABLE}
           SET role = 'admin'
           WHERE role IS NULL`,
        ),
      )
      .then(() =>
        getDb().query(
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
        ),
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
      role,
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
  role,
}: {
  email: string;
  password: string;
  role: AdminUserRole;
}) {
  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    throw new Error("Admin email is required");
  }

  if (!password) {
    throw new Error("Admin password is required");
  }

  if (!parseAdminUserRole(role)) {
    throw new Error("Admin role must be owner or admin");
  }

  const passwordHash = await hashPassword(password);
  const result = await getDb().query<AdminUserRow>(
    `INSERT INTO ${ADMIN_USERS_TABLE} (
      normalized_email,
      email,
      password_hash,
      role
    ) VALUES ($1, $2, $3, $4)
    ON CONFLICT (normalized_email) DO UPDATE
      SET email = EXCLUDED.email,
          password_hash = EXCLUDED.password_hash,
          role = EXCLUDED.role
    RETURNING
      normalized_email,
      email,
      password_hash,
      role,
      created_at`,
    [normalizedEmail, email.trim(), passwordHash, role],
  );

  return mapAdminUserRow(result.rows[0]);
}

export async function getOwnerAdminUser(): Promise<AdminUserRecord | null> {
  const result = await getDb().query<AdminUserRow>(
    `SELECT
      normalized_email,
      email,
      password_hash,
      role,
      created_at
     FROM ${ADMIN_USERS_TABLE}
     WHERE role = 'owner'
     ORDER BY created_at ASC
     LIMIT 1`,
  );

  if (result.rowCount !== 1) {
    return null;
  }

  return mapAdminUserRow(result.rows[0]);
}
