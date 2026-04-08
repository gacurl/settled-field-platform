<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Settled Field Platform

## Purpose
This repository is for the Settled Field Platform only.

The product is a conversion system for Summit and future offerings, not a generic website rebuild.

Primary business goal:
Guide users through the locked MVP flow:

Landing → Summit → Register → Pay → Confirmation

## Project Identity
- Client: Bill Krueper
- Brand anchor: #KeepDominating
- Headline tone: strong, directional
- Body tone: calm, structured, real-world
- CTA tone: direct action

Core headline direction:
**Find Your Direction — Keep Dominating**

## Product Rules
This product is:

- a guided experience for transition and direction
- a Summit registration and conversion system
- an admin-manageable operational platform

This product is not:

- a blog platform
- a generic event page
- an LMS or course platform in v1
- a community/chat platform in v1

## Locked MVP Scope
Included:
- Landing page
- Summit page
- Registration flow (no login)
- Stripe Checkout
- Confirmation page
- Admin dashboard for:
  - attendees
  - speakers
  - content links
  - settings

Excluded:
- user accounts
- messaging/chat
- LMS/course platform
- multi-admin roles
- advanced analytics

## Locked Tech Direction
- Next.js (App Router)
- PostgreSQL
- Stripe Checkout
- Single admin auth
- GitHub Actions for CI/CD and security scanning

## Security Rules
Security is non-negotiable.

Must include and preserve:
- HTTPS only
- environment-based secrets
- no hardcoded credentials
- CodeQL scanning
- dependency review
- weekly security scans
- CVE exposure kept minimal and actively monitored

Do not introduce shortcuts that weaken security to move faster.

## Architecture Philosophy
- Keep it simple
- Keep it extensible
- Avoid premature abstraction
- Avoid microservices
- Prefer clarity over cleverness

When choosing between a clever pattern and a clear pattern, choose the clear pattern.

## Admin Philosophy
Build the admin so Bill can run the Summit without needing engineering help for normal operations.

Admin should feel:
- simple
- fast
- intuitive

## Data Model Direction (v1)
Current core entities:
- Attendee
- Registration
- Speaker
- Content

Do not expand the model without issue-level justification.

## Build Discipline
For every issue:
- stay inside issue scope
- do not mix structure work with feature work
- do not add dependencies unless the issue explicitly requires them
- preserve build integrity at all times
- preserve existing site content and migration concerns
- avoid speculative implementation

## Current Early-Phase Rule
During Milestone 0 and early scaffolding:
- structure first
- placeholders are acceptable
- no hidden business logic
- no accidental styling expansion
- no feature creep

## Expected Change Output
When returning implementation analysis, prefer this format:

1. Diff summary
2. Files changed
3. Risks
4. Verification

## Stop Conditions
Stop and surface the issue instead of pushing through if:
- app router structure is unclear
- a change forces scope beyond the issue
- a dependency appears required unexpectedly
- build integrity is at risk
- security posture would be weakened
- existing site preservation assumptions become unclear

## Definition of Success
Build a secure MVP conversion system that moves users cleanly through:

Attention → Trust → Decision → Commitment → Reinforcement

Everything in this repo should support that outcome.