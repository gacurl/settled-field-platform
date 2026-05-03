# Lighthouse Rerun Guidance

Use this project’s Lighthouse reruns for production-readiness checks, not noisy localhost extension sessions.

## Run Conditions

- use a clean Chrome profile or Incognito
- disable extensions
- test the deployed production URL when available
- if testing locally, use a production build with:
  - `npm run build`
  - `npm run start`

## Recommended Pages

- `/`
- `/summit`
- `/register`
- `/admin`
- `/admin/users`

## What To Ignore

- browser-extension requests or console noise
- localhost-only caching differences
- development-only script behavior

## What To Verify

- dark/light theme stays stable after admin redirects and form submits
- security headers are present on production responses
- images report explicit dimensions
- admin account action links remain distinguishable in accessibility audits
