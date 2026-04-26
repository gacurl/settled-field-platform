# AGENTS.md — Settled Field Platform

## Core Identity

This project is a **conversion system**, not a general website.

Primary objective:
Move users from attention → trust → decision → commitment.

---

## Source of Truth Hierarchy

When instructions conflict, use this order:

1. Direct user instruction (current task)
2. AGENTS.md
3. Actual repo state
4. docs/codex/PROJECT_MEMORY.md
5. docs/codex/CURRENT_STATE.md

Docs provide context, not authority over instructions or code.

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

## Public Site Conversion Rules (LOCKED)

Landing experience MUST follow:

Hero → CTA → Trust → Supporting detail → CTA

Rules:

* Do not add new sections unless explicitly required
* Do not duplicate messaging across sections
* Each section must introduce new value
* Trust must appear before deeper explanation
* CTA placement must feel intentional, not repetitive
* Preserve tone:

  * strong headline
  * calm body
  * direct CTA

---

## Current Priority — Meeting-Ready Public Site

The system is in a **presentation refinement phase**.

Focus:

* clarity
* flow
* trust
* visual rhythm

Do NOT:

* restart payment work
* expand admin features
* introduce new product ideas
* redesign stable components

---

## Workflow Rules

* One GitHub issue per branch
* Branch naming: `issue-X-Y-description`
* Commit format: `Issue X-Y: <plain English>`

Before starting a new issue:

1. Commit current work
2. Create PR
3. Merge PR
4. Delete branch locally
5. Pull fresh main

Do not skip this sequence.

---

## Testing Discipline

For any user-facing change:

1. Run automated checks
2. Manually verify full user path
3. Confirm no regression to existing site content
4. Confirm scope was respected

CI passing is not sufficient alone.

---

## Output Requirements

Return:

1. Focused diff summary
2. Files changed
3. Why it works
4. Risks / edge cases
5. Tests run
6. Manual verification steps
7. Commit message (only when complete)

---

## Stop Conditions

Stop immediately if:

* scope expands beyond issue
* security posture weakens
* auth boundaries weaken
* dependency required without approval
* instructions are ambiguous enough to risk the system

Report:

* what was attempted
* what is blocked
* smallest safe next step

---

## Isolation Rule

This project is isolated.

Do NOT:

* import patterns from other repos
* assume shared architecture

Only use:

* AGENTS.md
* PROJECT_MEMORY.md
* CURRENT_STATE.md

If unsure — ask before acting.
