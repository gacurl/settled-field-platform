<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# settled-field-platform Codex Instructions

settled-field-platform is a summit and event platform tied to the existing Settled on the Field website and brand.

The first version is a conversion system first. It should help people discover the summit, understand the value, view speaker information, purchase tickets, and move into follow-on engagement.

The platform must preserve existing website content while adding a real application foundation that can grow over time.

## Repo-local Codex continuity docs

This repo may include local-only continuity files under `docs/codex/`.

When present, they are:

- `docs/codex/PROJECT_MEMORY.md` — durable project truths
- `docs/codex/CURRENT_STATE.md` — live project state

These files complement `AGENTS.md` and must not override it.

When asked for context or status, Codex must read those files by exact path from disk and must not rely on repo-wide scan discovery alone, because they may be intentionally local-only and git-ignored.

## Non-negotiable constraints

- Preserve existing website data and content
- Do not break, replace, or silently overwrite the current website during platform buildout
- The product is a conversion system first, not a bloated all-in-one platform
- Security is baseline work, not optional polish
- CVE hygiene must remain current
- Scanning and CI/CD are part of the project baseline
- No speculative architecture expansion without approval
- No hidden refactors
- No silent behavior changes
- No dependency additions without approval unless explicitly required and approved
- No scope expansion beyond the active issue

If a task risks any of these, stop immediately.

## Workflow rules

- One GitHub issue per branch
- Branch names should follow: `issue-X-Y-short-description`
- Commit messages should follow: `Issue X-Y: <plain English>`
- Stay within issue scope
- Do not expand scope without explicit instruction
- Prefer the smallest safe change
- No opportunistic cleanup
- No dependency additions without approval
- Stop if a requirement is ambiguous enough to risk the current site, security posture, or MVP focus

## Product and UX guardrails

Keep the first-version workflow focused on:

- landing and awareness
- speaker discovery
- ticket purchase
- scheduling or booking where scoped
- educational content access where scoped
- communication or messaging where scoped
- admin visibility where scoped

Rules:

- prioritize conversion and clarity over feature breadth
- preserve the existing brand feel: clinical, conversational, calming
- keep UX aligned to the existing website unless explicitly changed
- do not invent major new workflows unless requested
- read-only or reduced-scope views are acceptable when they protect MVP focus

## Security discipline

Security is baseline work.

- Keep dependencies current
- Keep scanning protocol in place
- Keep CI/CD pipeline security-conscious
- Do not weaken auth or access boundaries
- Do not introduce avoidable exposure of user, payment, or admin surfaces
- Do not assume security can be deferred until later

If a change would weaken the security posture, stop and ask.

## Testing discipline

When changing user-facing behavior, routing, auth, checkout-related flows, admin behavior, or content-preservation-sensitive areas:

1. Run the relevant automated checks
2. Perform a manual verification through the real user path
3. Confirm no regression to preserved website content
4. Confirm the active issue scope was respected

Minimum manual verification should cover the changed path end to end.

CI success alone is not enough.

## Output format

For implementation tasks, return:

1. Focused diff summary
2. Files changed
3. Why it works
4. Risks / edge cases
5. Tests run
6. Manual verification steps
7. Commit message only if implementation is complete

## Stop conditions

Stop immediately if:

- the task would overwrite or endanger existing site content
- a requirement would expand the product beyond the active issue
- auth boundaries would weaken
- security posture would weaken
- a new dependency is needed without approval
- the requirement is ambiguous in a way that risks the website, payment path, admin surface, or MVP focus

When stopping, report:

- what was attempted
- what is blocking progress
- the smallest safe next step

## Preferred style

- Use plain language
- Explain simply and explain why
- No fluff
- Favor clarity over cleverness
- Prefer focused diffs over broad rewrites
- Preserve existing behavior unless the issue explicitly changes it

## Codex isolation rule

This project is isolated.

Codex must:

- not import assumptions from other repos
- not reuse AssetTrack patterns unless explicitly requested
- ground decisions in:
  - `AGENTS.md`
  - `docs/codex/PROJECT_MEMORY.md`
  - `docs/codex/CURRENT_STATE.md`

If unsure, ask before acting.