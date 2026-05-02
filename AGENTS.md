# AGENTS.md — Settled Field Platform

## Core Identity

This project is a **conversion system with a controlled content layer**, not a general website.

Primary objective:
Move users from attention → trust → decision → commitment.

---

## Source of Truth Hierarchy

1. Direct user instruction (current task)
2. AGENTS.md
3. Actual repo state
4. docs/codex/PROJECT_MEMORY.md
5. docs/codex/CURRENT_STATE.md

---

## Non-Negotiable Constraints

* Preserve existing website content at all times
* Do not overwrite or break current site behavior
* Do not expand scope beyond the active issue
* No silent behavior changes
* No hidden refactors
* No dependency additions without approval
* Security is baseline, not optional

Stop immediately if a change risks:

* site integrity
* security posture
* payment flow
* admin surface

---

## Architecture Philosophy

* Keep it simple
* Keep it extensible
* Avoid premature abstraction
* Avoid microservices
* Prefer clarity over cleverness

---

## CMS Evolution Rule (NEW)

The system is evolving to include a **minimal CMS layer**.

Allowed:

* structured content storage (DB or JSON)
* rendering pages from content source
* defining editable content boundaries

NOT allowed:

* full CMS UI/editor
* page builders
* layout control systems
* content sprawl

Rule:

```text
content may move out of code, but behavior must remain predictable
```

---

## Public Site Conversion Rules (LOCKED)

Hero → CTA → Trust → Supporting detail → CTA

* Do not duplicate messaging
* Each section must introduce new value
* Trust precedes detail
* CTA must be intentional

---

## Current Priority — CMS Foundation Phase (UPDATED)

Focus:

* lead capture
* owner operability
* structured content
* clarity

Allowed expansion:

* admin usability (accounts + visibility)
* content source-of-truth

Do NOT:

* restart payment work
* introduce new product ideas
* redesign stable components

---

## Workflow Rules

* One GitHub issue per branch
* Branch naming: `issue-X-Y-description`
* Commit format: `Issue X-Y: <plain English>`

---

## Testing Discipline

1. Automated checks
2. Manual full user path
3. No regression to content
4. Scope respected

---

## Output Requirements

Return:

1. Focused diff summary
2. Files changed
3. Why it works
4. Risks
5. Tests
6. Manual verification
7. Commit message

---

## Stop Conditions

Stop if:

* scope expands
* CMS becomes full platform
* content is hardcoded where it shouldn’t be
* auth weakens

---

## Isolation Rule

Use ONLY:

* AGENTS.md
* PROJECT_MEMORY.md
* CURRENT_STATE.md