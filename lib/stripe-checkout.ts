type StripeCheckoutConfig = {
  appUrl: string;
  priceId: string;
  secretKey: string;
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
