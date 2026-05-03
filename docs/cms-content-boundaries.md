# CMS Content Boundaries

## Purpose

This document defines the MVP editable content boundary for the public site.

It does not define CMS implementation, database design, admin screens, or page behavior changes.

The goal is to identify which existing public-facing content should become owner-editable later, while keeping layout, routing, and rendering structure controlled in code.

## Scope

Reviewed sources:

- `lib/content/landing.ts`
- `lib/content/summit.ts`
- `lib/content/logistics.ts`
- `lib/content/partners.ts`
- `app/page.tsx`
- `app/summit/page.tsx`

## Boundary Rule

Editable content:

- public-facing text
- section headings and subheadings
- list items and card copy
- partner entries
- logistics details
- CTA labels where the CTA destination already exists

Non-editable structural content:

- page order
- section layout and grouping
- routes and link destinations
- component structure
- styling classes
- image file selection and presentation
- conditional rendering behavior

MVP rule:

```text
owner can control message and factual content, but not page structure or behavior
```

## Editable Content Map

### Landing page

Source:

- `lib/content/landing.ts`
- `app/page.tsx`

Editable later:

- `hero`
  - eyebrow
  - title
  - body
  - primary CTA label
  - secondary CTA label
- `trust`
  - eyebrow
  - heading
  - cards array
    - title
    - body
  - primary CTA label
  - secondary CTA label
- `audience`
  - eyebrow
  - heading
  - audience items
- `themes`
  - eyebrow
  - heading
  - theme cards
    - title
    - body
- `gains`
  - eyebrow
  - heading
  - gain items
- `summitPreview`
  - eyebrow
  - heading
  - body
  - CTA label
- `resources`
  - eyebrow
  - heading
  - resource cards
    - title
    - body
- `finalCta`
  - heading
  - body
  - primary CTA label
  - secondary CTA label

Not editable in MVP:

- hero image path and alt text
- summit preview image path and alt text
- section order on the page
- which sections appear on the landing page
- `/summit` and `/register` destinations

### Summit page blocks

Source:

- `lib/content/summit.ts`
- `app/summit/page.tsx`

Editable later:

- `hero`
  - title
  - body
  - primary CTA label
  - secondary CTA label
- `overview`
  - eyebrow
  - heading
  - paragraphs array
- `speakerPerspective`
  - eyebrow
  - heading
  - cards array
    - title
    - body
- `themes`
  - eyebrow
  - heading
  - cards array
    - title
    - body
- `programStructure`
  - eyebrow
  - heading
  - day cards
    - title
    - items
- `outcomes`
  - eyebrow
  - heading
  - outcome items
- `finalCta`
  - heading
  - body
  - primary CTA label
  - secondary CTA label

Not editable in MVP:

- hero image path and alt text
- triptych image path and alt text
- order of summit sections
- presence of the image-only section
- `/register` and `/` destinations

### Logistics

Source:

- `lib/content/logistics.ts`
- `app/summit/page.tsx`

Editable later:

- section heading
- section subheading
- details array
  - label
  - value
- note
- CTA labels

Editable with restriction:

- CTA destinations should remain code-controlled in MVP even if labels become editable

Not editable in MVP:

- action href values
- primary versus secondary rendering logic
- section placement within the summit page

### Partners

Source:

- `lib/content/partners.ts`
- `app/page.tsx`
- `app/summit/page.tsx`

Editable later:

- landing partner section
  - heading
  - subheading
  - partner entries
    - name
    - role
    - description
  - CTA label
- summit partner section
  - heading
  - subheading
  - partner entries
    - name
    - role
    - description
  - CTA label

Editable later with caution:

- partner link values can be editable only if validated and intentionally surfaced in UI
- empty links in the current model should not force link rendering behavior changes

Not editable in MVP:

- whether partner links are rendered
- CTA destinations
- partner section placement on each page

## Structural Content That Stays in Code

The following remains code-controlled even after content becomes structured:

- page routing
- section sequencing
- grid and card layouts
- button versus text-link presentation
- image components, sizing, and placement
- CSS classes and visual styling
- any future gating, validation, or publish logic

## Recommended MVP Content Units

Keep the future CMS boundary tight:

- landing page content
- summit page content
- logistics content
- partners content

Do not expand MVP to include:

- layout composition tools
- page builders
- per-section visibility toggles
- arbitrary CTA destination editing
- media management

## Why This Boundary Fits The Current Repo

- The repo already separates public copy into `lib/content/*`.
- `app/page.tsx` and `app/summit/page.tsx` consume those modules without requiring behavior changes.
- The editable boundary is limited to content fields already represented as plain data.
- Structural concerns remain in code, which preserves predictable rendering and protects stable conversion flow.
