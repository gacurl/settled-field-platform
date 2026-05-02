# Environment Variables

## Required (Local + Vercel)

- STRIPE_SECRET_KEY
- STRIPE_PRICE_ID
- NEXT_PUBLIC_BASE_URL

## Interest Notification Email (7-11)

- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- SMTP_FROM
- OWNER_NOTIFICATION_EMAIL

Behavior:

- registration success should not fail if email delivery fails
- missing SMTP configuration means notifications are skipped
- secrets stay server-side only

## Webhooks (4-2)

- STRIPE_WEBHOOK_SECRET

## Rules

- Never expose secret keys client-side
- Vercel must mirror .env.local
- Missing env = fail fast
