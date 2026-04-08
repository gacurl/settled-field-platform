<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Settled Field Platform

## Purpose

This repository builds the Settled Field Platform.

It is a **conversion system**, not a generic website.

Primary flow (locked):

Landing → Summit → Register → Pay → Confirmation

---

## Execution Confidence Rules

All changes must prioritize high-confidence, low-risk execution.

### Scope Discipline
- Stay strictly within the current issue
- Do not expand scope or add features
- Do not mix structure work with feature work

### Change Constraints
- No new dependencies unless explicitly required
- No business logic unless explicitly required
- No data fetching unless explicitly required
- Prefer minimal, deterministic changes

### Framework Discipline
- Follow Next.js App Router conventions
- Do not assume legacy Pages Router behavior
- Keep layout and routing simple and predictable

### Required Output Format
All task responses must include:

1. diff summary  
2. files changed  
3. risks  
4. verification steps  

### Safety Rules
- Do not apply changes without review
- Stop and surface ambiguity instead of guessing
- Preserve build integrity at all times

---

## Product Rules

### This product is:
- a guided experience for transition and direction
- a Summit registration and conversion system

### This product is NOT:
- a blog
- a generic event site
- a course platform (v1)
- a messaging/chat system (v1)

---

## MVP Scope (Locked)

### Included
- Landing page
- Summit page
- Registration (no login)
- Stripe Checkout
- Confirmation page
- Admin (basic)

### Excluded
- user accounts
- messaging/chat
- LMS
- advanced analytics
- multi-admin roles

---

## Tech Direction (Locked)

- Next.js (App Router)
- PostgreSQL (planned)
- Stripe Checkout (planned)
- Single admin model

---

## Architecture Philosophy

- Keep it simple
- Keep it extensible
- Avoid premature abstraction
- Prefer clarity over cleverness

---

## Early Phase Rule (CRITICAL)

This phase is:

👉 **Structure-first**

Do:
- routes
- folders
- placeholders

Do NOT:
- implement features
- add styling beyond minimal placeholders
- introduce logic
- introduce integrations

---

## Admin Philosophy

The system must allow the client to operate without engineering support.

Admin should be:
- simple
- fast
- intuitive

---

## Security Baseline

Must be preserved at all times:

- HTTPS only
- no hardcoded secrets
- environment-based configuration
- dependency awareness (CVE-conscious)
- CI/CD security scanning

---

## Stop Conditions

Stop immediately if:

- scope expands beyond the issue
- routing behavior is unclear
- build may break
- a dependency appears unexpectedly required
- implementation requires assumptions not defined

---

## Definition of Success

A clean, secure system that moves users through:

Attention → Trust → Decision → Commitment → Reinforcement