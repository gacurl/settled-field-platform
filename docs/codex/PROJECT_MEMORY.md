# PROJECT_MEMORY.md — Settled Field Platform

## 1. Core Identity
- Project name: Settled Field Platform
- Client: Bill Krueper
- Brand anchor: #KeepDominating
- Purpose: build the conversion system for the Summit and future offerings

## 2. Core Problem
Target users, especially athletes and veterans, struggle with transition and direction.

The current website does not function as a conversion system and lacks a reliable structure for:
- registration
- payment
- engagement
- follow-up

## 3. Core Solution
Build a conversion system, not just a website.

System logic:
Attention → Trust → Decision → Commitment → Reinforcement

Core product components:
- Landing page
- Summit page
- Registration
- Payment
- Confirmation
- Admin control layer

## 4. Primary User Action
Primary user action:
**Register for the Summit and connect with other athletes and veterans**

## 5. Locked User Flow
This flow is locked:

**Landing → Summit → Register → Pay → Confirmation**

Do not rearrange this flow without explicit approval.

## 6. Locked Tone System
Headline:
- strong
- directional

Primary headline direction:
**Find Your Direction — Keep Dominating**

Body copy:
- calm
- structured
- real-world

CTA copy:
- direct
- action-oriented

Examples:
- Register Now
- View Summit

## 7. Positioning
This is not:
- a blog
- a generic event page
- a course platform in v1

This is:
- a guided experience for transition and direction

## 8. Locked MVP Scope
Included:
- Landing page
- Summit page
- Registration without login
- Stripe Checkout
- Confirmation page
- Admin dashboard with:
  - attendees
  - speakers
  - content links only
  - settings

Excluded:
- user accounts
- messaging/chat
- LMS/course platform
- multi-admin roles
- advanced analytics

## 9. Locked Tech Direction
- Next.js (App Router)
- PostgreSQL
- Stripe Checkout
- Single admin auth
- GitHub Actions for CI/CD and security

## 10. Security Requirements
Security is non-negotiable from day one.

Required baseline:
- CVEs monitored and minimized
- dependency review active
- CodeQL scanning
- weekly security scans
- HTTPS only
- environment variable secrets
- no hardcoded credentials

## 11. Architecture Philosophy
- Keep it simple
- Keep it extensible
- Avoid premature abstraction
- Avoid microservices
- Prefer clarity over cleverness

## 12. Admin Philosophy
The system should let Bill run the Summit without calling for help.

Admin experience should be:
- simple
- fast
- intuitive

## 13. v1 Data Model
Core entities:
- Attendee
- Registration
- Speaker
- Content

## 14. Locked Milestones
1. Technical Baseline
2. Public Experience
3. Registration + Payment
4. Admin Dashboard
5. Launch Hardening
6. Post-MVP (deferred)

## 15. Constraints
- target launch: August 1
- budget conscious
- preserve existing website content
- secure from day one

## 16. Active Risks
- scope creep
- WordPress content extraction / preservation complexity
- undefined pricing tiers
- timeline pressure

## 17. Strategic Intent
### WFGY 1.0
Deliver a working Summit system that serves the immediate business need.

### WFGY 2.0
Use this MVP as the foundation for a reusable platform that can support:
- future events
- content
- partnerships
- monetization

## 18. Long-Term Direction
Long-term, this can evolve into:
- an event platform
- a training environment
- a content delivery system
- a community entry point

## 19. Current Repo State
Current known state:
- repo exists
- Next.js scaffold exists
- git workflow is established
- Milestone 0 is defined
- Issue 0-1 is complete and merged
- Issue 0-2 is ready to execute
- Issue 0-2 objective: define safe route structure and placeholder skeleton only

## 20. Current Execution Rule
Right now, this is not feature work.

This phase is:
**locking the skeleton of the system**

For current structure issues:
- no new dependencies
- no business logic
- no feature expansion
- no styling beyond placeholders
- do not break the build

## 21. Current Next Issue
After Issue 0-2, next planned issue is:

**Issue 0-3: PostgreSQL connection**