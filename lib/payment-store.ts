import { getDb } from "@/lib/db";

const PAYMENTS_TABLE = "payments";
let paymentsTablePromise: Promise<void> | null = null;

export type PaymentRecord = {
  amountTotal: number;
  createdAt: string;
  currency: string;
  paymentStatus: string;
  registrationEmail: string;
  stripeCheckoutSessionId: string;
  stripeEventId: string;
  stripePaymentIntentId: string | null;
  updatedAt: string;
};

type CreatePaymentRecordInput = {
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  registrationEmail: string;
  stripeCheckoutSessionId: string;
  stripeEventId: string;
  stripePaymentIntentId: string | null;
};

type PaymentRow = {
  amount_total: number;
  created_at: string;
  currency: string;
  payment_status: string;
  registration_id: string;
  stripe_checkout_session_id: string;
  stripe_event_id: string;
  stripe_payment_intent_id: string | null;
  updated_at: string;
};

export async function initializePaymentStore() {
  if (!paymentsTablePromise) {
    paymentsTablePromise = getDb()
      .query(
        `CREATE TABLE IF NOT EXISTS ${PAYMENTS_TABLE} (
          registration_id TEXT NOT NULL REFERENCES registrations(normalized_email),
          stripe_checkout_session_id TEXT NOT NULL UNIQUE,
          stripe_event_id TEXT NOT NULL UNIQUE,
          stripe_payment_intent_id TEXT,
          amount_total INTEGER NOT NULL,
          currency TEXT NOT NULL,
          payment_status TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`,
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        paymentsTablePromise = null;
        throw error;
      });
  }

  await paymentsTablePromise;
}

export async function createPaymentRecord(
  input: CreatePaymentRecordInput,
): Promise<PaymentRecord> {
  const result = await getDb().query<PaymentRow>(
    `WITH inserted AS (
      INSERT INTO ${PAYMENTS_TABLE} (
        registration_id,
        stripe_checkout_session_id,
        stripe_event_id,
        stripe_payment_intent_id,
        amount_total,
        currency,
        payment_status,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT DO NOTHING
      RETURNING
        registration_id,
        stripe_checkout_session_id,
        stripe_event_id,
        stripe_payment_intent_id,
        amount_total,
        currency,
        payment_status,
        created_at,
        updated_at
    ),
    existing AS (
      SELECT
        registration_id,
        stripe_checkout_session_id,
        stripe_event_id,
        stripe_payment_intent_id,
        amount_total,
        currency,
        payment_status,
        created_at,
        updated_at
      FROM ${PAYMENTS_TABLE}
      WHERE stripe_checkout_session_id = $2 OR stripe_event_id = $3
      ORDER BY
        CASE
          WHEN stripe_checkout_session_id = $2 THEN 0
          ELSE 1
        END,
        created_at ASC
      LIMIT 1
    )
    SELECT
      registration_id,
      stripe_checkout_session_id,
      stripe_event_id,
      stripe_payment_intent_id,
      amount_total,
      currency,
      payment_status,
      created_at,
      updated_at
    FROM inserted
    UNION ALL
    SELECT
      registration_id,
      stripe_checkout_session_id,
      stripe_event_id,
      stripe_payment_intent_id,
      amount_total,
      currency,
      payment_status,
      created_at,
      updated_at
    FROM existing
    LIMIT 1`,
    [
      input.registrationEmail,
      input.stripeCheckoutSessionId,
      input.stripeEventId,
      input.stripePaymentIntentId,
      input.amountTotal,
      input.currency,
      input.paymentStatus,
    ],
  );

  if (!result.rows[0]) {
    throw new Error("Unable to persist payment record.");
  }

  return mapPaymentRow(result.rows[0]);
}

function mapPaymentRow(row: PaymentRow): PaymentRecord {
  return {
    amountTotal: row.amount_total,
    createdAt: row.created_at,
    currency: row.currency,
    paymentStatus: row.payment_status,
    registrationEmail: row.registration_id,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripeEventId: row.stripe_event_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    updatedAt: row.updated_at,
  };
}
