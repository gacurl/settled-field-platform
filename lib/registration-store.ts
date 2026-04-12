import { getDb } from "@/lib/db";
import type {
  DuplicateRegistrationStatus,
  RegistrationFormValues,
} from "@/app/register/types";

const REGISTRATIONS_TABLE = "registrations";
const REGISTRATION_EMAILS_TABLE = "registration_emails";
let registrationsTablePromise: Promise<void> | null = null;

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
