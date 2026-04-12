import { getDb } from "@/lib/db";
import type { DuplicateRegistrationStatus } from "@/app/register/types";

const REGISTRATION_EMAILS_TABLE = "registration_emails";
let registrationEmailsTablePromise: Promise<void> | null = null;

export async function initializeRegistrationEmailStore() {
  if (!registrationEmailsTablePromise) {
    registrationEmailsTablePromise = getDb()
      .query(
        `CREATE TABLE IF NOT EXISTS ${REGISTRATION_EMAILS_TABLE} (
          normalized_email TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        registrationEmailsTablePromise = null;
        throw error;
      });
  }

  await registrationEmailsTablePromise;
}

export async function reserveRegistrationEmail(
  email: string,
): Promise<DuplicateRegistrationStatus> {
  const result = await getDb().query(
    `INSERT INTO ${REGISTRATION_EMAILS_TABLE} (normalized_email)
     VALUES ($1)
     ON CONFLICT (normalized_email) DO NOTHING`,
    [email],
  );

  return result.rowCount === 1 ? "created" : "duplicate";
}
