import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getDb } from "@/lib/db";

export const ADMIN_USERS_TABLE = "admin_users";
const SCRYPT_KEY_LENGTH = 64;
const MIN_ADMIN_PASSWORD_LENGTH = 8;
const scrypt = promisify(nodeScrypt);

let adminUsersTablePromise: Promise<void> | null = null;

type AdminUserRow = {
  created_at: string;
  email: string;
  is_active: boolean;
  normalized_email: string;
  password_hash: string;
  role: string;
};

export const ADMIN_USER_ROLES = ["owner", "admin"] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];

export type AdminUserRecord = {
  createdAt: string;
  email: string;
  isActive: boolean;
  normalizedEmail: string;
  passwordHash: string;
  role: AdminUserRole;
};

export function normalizeAdminEmail(value: string) {
  return value.trim().toLowerCase();
}

function validateAdminPassword(password: string) {
  if (!password) {
    throw new Error("Admin password is required");
  }

  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(`Admin password must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters`);
  }
}

function mapAdminUserRow(row: AdminUserRow): AdminUserRecord {
  const role = parseAdminUserRole(row.role);

  if (!role) {
    throw new Error(`Invalid admin user role for ${row.normalized_email}`);
  }

  if (typeof row.is_active !== "boolean") {
    throw new Error(`Invalid admin user status for ${row.normalized_email}`);
  }

  return {
    createdAt: row.created_at,
    email: row.email,
    isActive: row.is_active,
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

export async function createAdminPasswordHash(password: string) {
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
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`)
      .then(() =>
        getDb().query(
          `ALTER TABLE ${ADMIN_USERS_TABLE}
           ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE`,
        ),
      )
      .then(() =>
        getDb().query(
          `UPDATE ${ADMIN_USERS_TABLE}
           SET is_active = TRUE
           WHERE is_active IS NULL`,
        ),
      )
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
  await initializeAdminUserStore();

  const result = await getDb().query<AdminUserRow>(
    `SELECT
      normalized_email,
      email,
      is_active,
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

  await initializeAdminUserStore();

  const adminUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (!adminUser) {
    return null;
  }

  if (!adminUser.isActive) {
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
  await initializeAdminUserStore();

  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    throw new Error("Admin email is required");
  }

  validateAdminPassword(password);

  if (!parseAdminUserRole(role)) {
    throw new Error("Admin role must be owner or admin");
  }

  const passwordHash = await createAdminPasswordHash(password);
  const result = await getDb().query<AdminUserRow>(
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
          role = EXCLUDED.role
    RETURNING
      normalized_email,
      email,
      is_active,
      password_hash,
      role,
      created_at`,
    [normalizedEmail, email.trim(), passwordHash, role],
  );

  return mapAdminUserRow(result.rows[0]);
}

export async function getOwnerAdminUser(): Promise<AdminUserRecord | null> {
  await initializeAdminUserStore();

  const result = await getDb().query<AdminUserRow>(
    `SELECT
      normalized_email,
      email,
      is_active,
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

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  await initializeAdminUserStore();

  const result = await getDb().query<AdminUserRow>(
    `SELECT
      normalized_email,
      email,
      is_active,
      password_hash,
      role,
      created_at
     FROM ${ADMIN_USERS_TABLE}
     ORDER BY
      CASE role WHEN 'owner' THEN 0 ELSE 1 END,
      created_at ASC`,
  );

  return result.rows.map(mapAdminUserRow);
}

export async function createHelperAdminUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  await initializeAdminUserStore();

  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    throw new Error("Helper email is required");
  }

  validateAdminPassword(password);

  const existingUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("That email already has access");
  }

  return upsertAdminUser({
    email,
    password,
    role: "admin",
  });
}

async function countActiveOwners() {
  await initializeAdminUserStore();

  const result = await getDb().query<{ total: string }>(
    `SELECT COUNT(*)::text AS total
     FROM ${ADMIN_USERS_TABLE}
     WHERE role = 'owner' AND is_active = TRUE`,
  );

  return Number(result.rows[0]?.total ?? "0");
}

export async function disableAdminUser(
  normalizedEmail: string,
): Promise<AdminUserRecord> {
  await initializeAdminUserStore();

  const adminUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (!adminUser) {
    throw new Error("Admin user not found");
  }

  if (!adminUser.isActive) {
    return adminUser;
  }

  if (adminUser.role === "owner" && (await countActiveOwners()) <= 1) {
    throw new Error("Keep at least one active owner");
  }

  const result = await getDb().query<AdminUserRow>(
    `UPDATE ${ADMIN_USERS_TABLE}
     SET is_active = FALSE
     WHERE normalized_email = $1
     RETURNING
      normalized_email,
      email,
      is_active,
      password_hash,
      role,
      created_at`,
    [normalizedEmail],
  );

  if (result.rowCount !== 1) {
    throw new Error("Admin user not found");
  }

  return mapAdminUserRow(result.rows[0]);
}

export async function removeAdminUser(
  normalizedEmail: string,
): Promise<AdminUserRecord> {
  await initializeAdminUserStore();

  const adminUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (!adminUser) {
    throw new Error("Admin user not found");
  }

  if (adminUser.role === "owner" && adminUser.isActive && (await countActiveOwners()) <= 1) {
    throw new Error("Keep at least one active owner");
  }

  const result = await getDb().query<AdminUserRow>(
    `DELETE FROM ${ADMIN_USERS_TABLE}
     WHERE normalized_email = $1
     RETURNING
      normalized_email,
      email,
      is_active,
      password_hash,
      role,
      created_at`,
    [normalizedEmail],
  );

  if (result.rowCount !== 1) {
    throw new Error("Admin user not found");
  }

  return mapAdminUserRow(result.rows[0]);
}

export async function createManagedAdminUser({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: AdminUserRole;
}) {
  await initializeAdminUserStore();

  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail) {
    throw new Error("Admin email is required");
  }

  validateAdminPassword(password);

  if (!parseAdminUserRole(role)) {
    throw new Error("Admin role must be owner or admin");
  }

  const existingUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("That email already has access");
  }

  return upsertAdminUser({
    email,
    password,
    role,
  });
}

export async function updateAdminUserEmail({
  normalizedEmail,
  nextEmail,
}: {
  normalizedEmail: string;
  nextEmail: string;
}) {
  await initializeAdminUserStore();

  const existingUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (!existingUser) {
    throw new Error("Admin user not found");
  }

  const nextNormalizedEmail = normalizeAdminEmail(nextEmail);

  if (!nextNormalizedEmail) {
    throw new Error("Admin email is required");
  }

  if (nextNormalizedEmail !== normalizedEmail) {
    const conflictingUser = await findAdminUserByNormalizedEmail(nextNormalizedEmail);

    if (conflictingUser) {
      throw new Error("That email already has access");
    }
  }

  const result = await getDb().query<AdminUserRow>(
    `UPDATE ${ADMIN_USERS_TABLE}
     SET normalized_email = $2,
         email = $3
     WHERE normalized_email = $1
     RETURNING
      normalized_email,
      email,
      is_active,
      password_hash,
      role,
      created_at`,
    [normalizedEmail, nextNormalizedEmail, nextEmail.trim()],
  );

  if (result.rowCount !== 1) {
    throw new Error("Admin user not found");
  }

  return mapAdminUserRow(result.rows[0]);
}

export async function resetAdminUserPassword({
  normalizedEmail,
  password,
}: {
  normalizedEmail: string;
  password: string;
}) {
  await initializeAdminUserStore();

  const existingUser = await findAdminUserByNormalizedEmail(normalizedEmail);

  if (!existingUser) {
    throw new Error("Admin user not found");
  }

  validateAdminPassword(password);

  const passwordHash = await createAdminPasswordHash(password);
  const result = await getDb().query<AdminUserRow>(
    `UPDATE ${ADMIN_USERS_TABLE}
     SET password_hash = $2
     WHERE normalized_email = $1
     RETURNING
      normalized_email,
      email,
      is_active,
      password_hash,
      role,
      created_at`,
    [normalizedEmail, passwordHash],
  );

  if (result.rowCount !== 1) {
    throw new Error("Admin user not found");
  }

  return mapAdminUserRow(result.rows[0]);
}
