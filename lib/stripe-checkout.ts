import type { RegistrationDraft } from "@/app/register/types";

type StripeCheckoutConfig = {
  appUrl: string;
  priceId: string;
  secretKey: string;
};

type StripeCheckoutSessionPayload = {
  cancel_url: string;
  customer_email: string;
  line_items: Array<{
    price: string;
    quantity: number;
  }>;
  metadata: Record<string, string>;
  mode: "payment";
  success_url: string;
};

function normalizeAppUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getStripeCheckoutConfig(): StripeCheckoutConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!secretKey || !priceId || !appUrl) {
    return null;
  }

  return {
    appUrl: normalizeAppUrl(appUrl),
    priceId,
    secretKey,
  };
}

export function buildStripeCheckoutSessionPayload(
  draft: RegistrationDraft,
  config: StripeCheckoutConfig,
): StripeCheckoutSessionPayload {
  return {
    cancel_url: `${config.appUrl}/register?step=payment&mode=cancelled`,
    customer_email: draft.email,
    line_items: [
      {
        price: config.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      attendeeEmail: draft.email,
      attendeeName: `${draft.firstName} ${draft.lastName}`.trim(),
      organization: draft.organization,
      role: draft.role,
      submittedAt: draft.submittedAt,
    },
    mode: "payment",
    success_url: `${config.appUrl}/confirmation?mode=checkout`,
  };
}
