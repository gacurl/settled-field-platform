import { getDb } from "@/lib/db";
import type {
  DuplicateRegistrationStatus,
  RegistrationFormValues,
} from "@/app/register/types";

const REGISTRATIONS_TABLE = "registrations";
const REGISTRATION_EMAILS_TABLE = "registration_emails";
let registrationsTablePromise: Promise<void> | null = null;

export type RegistrationRecord = {
  createdAt: string;
  email: string;
  fullName: string;
  normalizedEmail: string;
  organizationOrAffiliation: string | null;
};

type RegistrationRow = {
  created_at: string;
  email: string;
  full_name: string;
  normalized_email: string;
  organization_or_affiliation: string | null;
};

function buildFullName(values: RegistrationFormValues) {
  return `${values.firstName} ${values.lastName}`.trim();
}

export async function initializeRegistrationStore() {
  if (!registrationsTablePromise) {
    registrationsTablePromise = getDb()
      .query(
        `CREATE TABLE IF NOT EXISTS ${REGISTRATIONS_TABLE} (
          normalized_email TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          organization_or_affiliation TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        registrationsTablePromise = null;
        throw error;
      });
  }

  await registrationsTablePromise;
}

export async function createRegistration(
  values: RegistrationFormValues,
): Promise<DuplicateRegistrationStatus> {
  const client = await getDb().connect();

  try {
    await client.query("BEGIN");

    const duplicateResult = await client.query(
      `INSERT INTO ${REGISTRATION_EMAILS_TABLE} (normalized_email)
       VALUES ($1)
       ON CONFLICT (normalized_email) DO NOTHING`,
      [values.email],
    );

    if (duplicateResult.rowCount !== 1) {
      await client.query("ROLLBACK");
      return "duplicate";
    }

    await client.query(
      `INSERT INTO ${REGISTRATIONS_TABLE} (
        full_name,
        email,
        normalized_email,
        organization_or_affiliation
      ) VALUES ($1, $2, $3, $4)`,
      [
        buildFullName(values),
        values.email,
        values.email,
        values.organization || null,
      ],
    );

    await client.query("COMMIT");
    return "created";
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listRegistrations(): Promise<RegistrationRecord[]> {
  const result = await getDb().query<RegistrationRow>(
    `SELECT
      full_name,
      email,
      normalized_email,
      organization_or_affiliation,
      created_at
     FROM ${REGISTRATIONS_TABLE}
     ORDER BY created_at DESC`,
  );

  return result.rows.map(mapRegistrationRow);
}

export async function getRegistrationByNormalizedEmail(normalizedEmail: string) {
  const normalizedRegistrationEmail = normalizedEmail.trim().toLowerCase();

  if (!normalizedRegistrationEmail) {
    return null;
  }

  const result = await getDb().query<RegistrationRow>(
    `SELECT
      full_name,
      email,
      normalized_email,
      organization_or_affiliation,
      created_at
     FROM ${REGISTRATIONS_TABLE}
     WHERE normalized_email = $1`,
    [normalizedRegistrationEmail],
  );

  return result.rows[0] ? mapRegistrationRow(result.rows[0]) : null;
}

function mapRegistrationRow(row: RegistrationRow): RegistrationRecord {
  return {
    createdAt: row.created_at,
    email: row.email,
    fullName: row.full_name,
    normalizedEmail: row.normalized_email,
    organizationOrAffiliation: row.organization_or_affiliation,
  };
}
