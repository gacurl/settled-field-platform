# Missing Assets

## Purpose

This list captures the public-site assets that are still needed from Bill or the brand team to complete a cleaner, more credible visual system.

## Naming Convention

Use:

`type-context-variant.ext`

Examples:

- `logo-primary-dark.png`
- `logo-mark-light.png`
- `hero-landing-main.jpg`
- `image-summit-energy.jpg`
- `partner-example-logo.png`
- `speaker-first-last.jpg`
- `social-podcast-cover.png`

## Highest Priority Requests

| Needed asset | Recommended destination | Why it is needed | Notes |
| --- | --- | --- | --- |
| Official Settled on the Field primary logo | `public/assets/logos/` | Needed for consistent brand usage across header, footer, social, and partner materials | Request transparent PNG and SVG versions. |
| Official logo mark / icon | `public/assets/logos/` | Needed for compact placements and favicon/social adaptations | Request light and dark variants if they exist. |
| Confirmed social channel URLs | `public/assets/social/` | Footer and future social proof areas need real destinations | Current footer uses placeholder-safe copy only. |
| Confirmed public contact method | n/a | Needed to replace placeholder contact assumptions | Confirm whether email, form, or another route should be public. |

## Summit Content Requests

| Needed asset | Recommended destination | Why it is needed | Notes |
| --- | --- | --- | --- |
| Final summit hero image set | `public/assets/summit/` | Gives flexibility for landing, summit, and social placements | Current hero image is usable, but a curated set would improve consistency. |
| Additional summit atmosphere images | `public/assets/summit/` | Supports future editorial breaks without reusing a single image too often | Locker room, team huddle, track, preparation, audience, and speaker-room angles would help. |
| Final speaker headshots | `public/assets/speakers/` | Needed if speaker lineup becomes more visible | Request consistent crop, background, and licensing. |
| Speaker names with approved filenames | `public/assets/speakers/` | Prevents ad hoc naming and mismatched references | Use `speaker-first-last.ext`. |

## Partner and Ecosystem Requests

| Needed asset | Recommended destination | Why it is needed | Notes |
| --- | --- | --- | --- |
| Approved partner or sponsor logos | `public/assets/partners/` | Needed to turn the placeholder partners band into a real credibility block | Request transparent PNG or SVG plus approved display name. |
| Partner website URLs | n/a | Needed before any outbound logo linking is added | Keep separate from asset ingestion. |
| Any ecosystem or affiliate marks | `public/assets/partners/` | Useful for footer or partner sections if applicable | Only request marks that are approved for public display. |

## Social Surface Requests

| Needed asset | Recommended destination | Why it is needed | Notes |
| --- | --- | --- | --- |
| Podcast / YouTube cover art | `public/assets/social/` | Needed for future social proof and ecosystem references | Useful if footer or bands evolve beyond placeholder text. |
| Instagram profile imagery | `public/assets/social/` | Needed for consistent cross-platform presentation | Optional now, valuable later. |
| Social card / OG share images | `public/assets/social/` | Needed for better link sharing and campaign polish | Request variants for landing and summit pages if available. |

## Cleanup Follow-Up Recommendations

- Confirm whether `logo-primary.jpeg` and `grass-logo.jpeg` are intended final brand assets.
- Replace mismatched extensions on current binary files only in a dedicated follow-up issue that also updates all references safely.
- Remove or archive Next.js starter SVGs only after confirming they are not needed anywhere in the project.
