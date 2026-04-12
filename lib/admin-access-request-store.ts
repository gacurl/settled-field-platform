import { getDb } from "@/lib/db";
import {
  ADMIN_USERS_TABLE,
  createAdminPasswordHash,
  findAdminUserByNormalizedEmail,
  normalizeAdminEmail,
} from "@/lib/admin-user-store";

const ADMIN_ACCESS_REQUESTS_TABLE = "admin_access_requests";
const ADMIN_ACCESS_REQUESTS_PENDING_INDEX =
  "admin_access_requests_pending_email_idx";
const ADMIN_ACCESS_REQUESTS_STATUS_CONSTRAINT =
  "admin_access_requests_status_check";

let adminAccessRequestsTablePromise: Promise<void> | null = null;

type AdminAccessRequestRow = {
  created_at: string;
  email: string;
  full_name: string;
  id: number;
  normalized_email: string;
  organization: string | null;
  status: string;
};

export const ADMIN_ACCESS_REQUEST_STATUSES = [
  "pending",
  "approved",
  "denied",
] as const;

export type AdminAccessRequestStatus =
  (typeof ADMIN_ACCESS_REQUEST_STATUSES)[number];

export type AdminAccessRequestRecord = {
  createdAt: string;
  email: string;
  fullName: string;
  id: number;
  normalizedEmail: string;
  organization: string | null;
  status: AdminAccessRequestStatus;
};

export type CreateAdminAccessRequestStatus =
  | "created"
  | "already-has-access"
  | "pending";

function parseAdminAccessRequestStatus(
  value: unknown,
): AdminAccessRequestStatus | null {
  if (typeof value !== "string") {
    return null;
  }

  return (
    ADMIN_ACCESS_REQUEST_STATUSES.find((status) => status === value) ?? null
  );
}

function mapAdminAccessRequestRow(
  row: AdminAccessRequestRow,
): AdminAccessRequestRecord {
  const status = parseAdminAccessRequestStatus(row.status);

  if (!status) {
    throw new Error(`Invalid admin access request status for ${row.id}`);
  }

  return {
    createdAt: row.created_at,
    email: row.email,
    fullName: row.full_name,
    id: row.id,
    normalizedEmail: row.normalized_email,
    organization: row.organization,
    status,
  };
}

export async function initializeAdminAccessRequestStore() {
  if (!adminAccessRequestsTablePromise) {
    adminAccessRequestsTablePromise = getDb()
      .query(`CREATE TABLE IF NOT EXISTS ${ADMIN_ACCESS_REQUESTS_TABLE} (
        id BIGSERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        normalized_email TEXT NOT NULL,
        organization TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`)
      .then(() =>
        getDb().query(
          `DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1
              FROM pg_constraint
              WHERE conname = '${ADMIN_ACCESS_REQUESTS_STATUS_CONSTRAINT}'
            ) THEN
              ALTER TABLE ${ADMIN_ACCESS_REQUESTS_TABLE}
              ADD CONSTRAINT ${ADMIN_ACCESS_REQUESTS_STATUS_CONSTRAINT}
              CHECK (status IN ('pending', 'approved', 'denied'));
            END IF;
          END $$;`,
        ),
      )
      .then(() =>
        getDb().query(
          `CREATE UNIQUE INDEX IF NOT EXISTS ${ADMIN_ACCESS_REQUESTS_PENDING_INDEX}
           ON ${ADMIN_ACCESS_REQUESTS_TABLE} (normalized_email)
           WHERE status = 'pending'`,
        ),
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        adminAccessRequestsTablePromise = null;
        throw error;
      });
  }

  await adminAccessRequestsTablePromise;
}

export async function createAdminAccessRequest({
  email,
  fullName,
  organization,
}: {
  email: string;
  fullName: string;
  organization?: string;
}): Promise<CreateAdminAccessRequestStatus> {
  const normalizedEmail = normalizeAdminEmail(email);
  const trimmedFullName = fullName.trim();

  if (!trimmedFullName) {
    throw new Error("Full name is required");
  }

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  if (await findAdminUserByNormalizedEmail(normalizedEmail)) {
    return "already-has-access";
  }

  try {
    await getDb().query(
      `INSERT INTO ${ADMIN_ACCESS_REQUESTS_TABLE} (
        full_name,
        email,
        normalized_email,
        organization,
        status
      ) VALUES ($1, $2, $3, $4, 'pending')`,
      [trimmedFullName, email.trim(), normalizedEmail, organization?.trim() || null],
    );

    return "created";
  } catch (error) {
    const pgError = error as { code?: string };

    if (pgError.code === "23505") {
      return "pending";
    }

    throw error;
  }
}

export async function listAdminAccessRequests(): Promise<
  AdminAccessRequestRecord[]
> {
  const result = await getDb().query<AdminAccessRequestRow>(
    `SELECT
      id,
      full_name,
      email,
      normalized_email,
      organization,
      status,
      created_at
     FROM ${ADMIN_ACCESS_REQUESTS_TABLE}
     ORDER BY
      CASE status
        WHEN 'pending' THEN 0
        WHEN 'approved' THEN 1
        ELSE 2
      END,
      created_at DESC`,
  );

  return result.rows.map(mapAdminAccessRequestRow);
}

export async function approveAdminAccessRequest({
  password,
  requestId,
}: {
  password: string;
  requestId: number;
}) {
  if (!password) {
    throw new Error("Password is required");
  }

  const client = await getDb().connect();

  try {
    await client.query("BEGIN");

    const requestResult = await client.query<AdminAccessRequestRow>(
      `SELECT
        id,
        full_name,
        email,
        normalized_email,
        organization,
        status,
        created_at
       FROM ${ADMIN_ACCESS_REQUESTS_TABLE}
       WHERE id = $1
       FOR UPDATE`,
      [requestId],
    );

    if (requestResult.rowCount !== 1) {
      throw new Error("Request not found");
    }

    const accessRequest = mapAdminAccessRequestRow(requestResult.rows[0]);

    if (accessRequest.status !== "pending") {
      throw new Error("Request is no longer pending");
    }

    const existingAdminResult = await client.query(
      `SELECT 1
       FROM ${ADMIN_USERS_TABLE}
       WHERE normalized_email = $1`,
      [accessRequest.normalizedEmail],
    );

    if (existingAdminResult.rowCount === 0) {
      const passwordHash = await createAdminPasswordHash(password);

      await client.query(
        `INSERT INTO ${ADMIN_USERS_TABLE} (
          normalized_email,
          email,
          password_hash,
          is_active,
          role
        ) VALUES ($1, $2, $3, TRUE, 'admin')`,
        [accessRequest.normalizedEmail, accessRequest.email, passwordHash],
      );
    }

    await client.query(
      `UPDATE ${ADMIN_ACCESS_REQUESTS_TABLE}
       SET status = 'approved'
       WHERE id = $1`,
      [requestId],
    );

    await client.query("COMMIT");
    return accessRequest;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function denyAdminAccessRequest(requestId: number) {
  const result = await getDb().query<AdminAccessRequestRow>(
    `UPDATE ${ADMIN_ACCESS_REQUESTS_TABLE}
     SET status = 'denied'
     WHERE id = $1
       AND status = 'pending'
     RETURNING
      id,
      full_name,
      email,
      normalized_email,
      organization,
      status,
      created_at`,
    [requestId],
  );

  if (result.rowCount !== 1) {
    throw new Error("Request not found");
  }

  return mapAdminAccessRequestRow(result.rows[0]);
}
