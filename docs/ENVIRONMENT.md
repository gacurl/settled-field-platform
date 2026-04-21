# Environment Variables

## Required (Local + Vercel)

- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID
- NEXT_PUBLIC_BASE_URL

## Webhooks (4-2)

- STRIPE_WEBHOOK_SECRET

## Rules

- Never expose secret keys client-side
- Vercel must mirror .env.local
- Missing env = fail fast