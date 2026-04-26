# Asset Inventory

## Purpose

This inventory tracks the current public-site assets in the repo, where they live now, where they should live long-term, and whether they are ready for production use.

This issue does not move or rename existing assets. Recommended destinations are documented only so runtime references stay intact.

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

## Current Assets

| Filename | Current location | Recommended destination | Likely use | Quality / status notes |
| --- | --- | --- | --- | --- |
| `success-summit-hero.png` | `public/assets/images/success-summit-hero.png` | `public/assets/images/hero-landing-main.png` | Landing hero image | Live on `/`. Good source size. Current name is acceptable but not aligned to the naming convention. |
| `success-summit-overview.svg` | `public/success-summit-overview.svg` | `public/assets/summit/image-summit-overview.svg` | Summit page hero/support visual | Live on `/summit`. Leave in place for now to avoid changing imports. |
| `success-summit-hero.svg` | `public/success-summit-hero.svg` | `public/assets/summit/image-summit-hero.svg` | Alternate summit visual or presentation asset | Present in repo but not currently referenced by the public site. |
| `summit-energy-triptych.png` | `public/assets/summit/summit-energy-triptych.png` | `public/assets/summit/image-summit-energy-triptych.png` | Mid-page Summit pacing image | Live on `/summit`. Good source size and placement-ready. |
| `curltech-logo-gray.png` | `public/assets/logos/curltech-logo-gray.png` | `public/assets/logos/logo-curltech-gray.png` | Subtle footer attribution | Live in footer. Production-usable for attribution. |
| `logo-primary.jpeg` | `public/assets/logos/logo-primary.jpeg` | `public/assets/logos/logo-primary-light.webp` | Settled on the Field primary logo candidate | File extension says `.jpeg`, but file data is WebP. Needs format cleanup before broader use. Not currently referenced. |
| `grass-logo.jpeg` | `public/assets/logos/grass-logo.jpeg` | `public/assets/logos/logo-mark-grass.webp` | Possible secondary mark or legacy brand asset | File extension says `.jpeg`, but file data is WebP. Not currently referenced. Needs confirmation before use. |
| `bill-headshot.jpg` | `public/assets/images/bill-headshot.jpg` | `public/assets/speakers/speaker-bill-krueper-headshot.jpg` | Speaker/host portrait | Usable source size is modest at 400x400. Best for cards or profile use, not large hero treatment. Not currently referenced. |
| `bill-navy-flight-deck.jpg` | `public/assets/images/bill-navy-flight-deck.jpg` | `public/assets/images/image-bill-flight-deck.png` | Editorial image for About/Speaker/Story sections | File extension says `.jpg`, but file data is PNG. Not currently referenced. Needs rename cleanup if adopted. |
| `bill-navy-handshake.jpg` | `public/assets/images/bill-navy-handshake.jpg` | `public/assets/images/image-bill-handshake.png` | Editorial image for story/credibility sections | File extension says `.jpg`, but file data is PNG. Not currently referenced. Large enough for flexible use. |
| `file.svg` | `public/file.svg` | none | Next.js starter asset | Boilerplate asset, not part of the public brand system. |
| `globe.svg` | `public/globe.svg` | none | Next.js starter asset | Boilerplate asset, not part of the public brand system. |
| `next.svg` | `public/next.svg` | none | Next.js starter asset | Boilerplate asset, not part of the public brand system. |
| `vercel.svg` | `public/vercel.svg` | none | Next.js starter asset | Boilerplate asset, not part of the public brand system. |
| `window.svg` | `public/window.svg` | none | Next.js starter asset | Boilerplate asset, not part of the public brand system. |

## Live Public References

These assets are currently referenced by public-facing pages or layout components:

- `public/assets/images/success-summit-hero.png`
- `public/success-summit-overview.svg`
- `public/assets/summit/summit-energy-triptych.png`
- `public/assets/logos/curltech-logo-gray.png`

## Notes

- `public/assets/.DS_Store` exists and should be ignored as a filesystem artifact, not treated as a real asset.
- Several files have extensions that do not match their underlying file format. Those should be corrected in a later asset cleanup issue, because renaming them now would require UI import updates.
- Empty folders created for future use:
  - `public/assets/partners/`
  - `public/assets/speakers/`
  - `public/assets/social/`
