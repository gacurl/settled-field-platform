# Environment Variables

## Required (Local + Vercel)

- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID
- NEXT_PUBLIC_BASE_URL

### Email notifications

Required for owner registration notifications:

- `RESEND_API_KEY`
- `OWNER_NOTIFICATION_EMAIL`

Email delivery uses Resend. If `RESEND_API_KEY` is missing, registration still succeeds and email notification is skipped.

## Webhooks (4-2)

- STRIPE_WEBHOOK_SECRET

## Rules

- Never expose secret keys client-side
- Vercel must mirror .env.local
- Missing env = fail fast
