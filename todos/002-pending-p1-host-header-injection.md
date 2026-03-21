---
status: done
priority: p1
issue_id: 002
tags: [code-review, security, performance]
---

# Site URL built from Host / X-Forwarded-Host (header injection + forced dynamic)

## Problem Statement
`siteUrl()` on the homepage constructs the site origin from attacker-controllable headers (`Host`, `X-Forwarded-Host`). That value is injected into JSON-LD and Open Graph metadata. It also forces the homepage to be dynamic (no ISR) because it calls `headers()`. Collections repeats the same pattern with a separate helper.

## Findings
- `app/page.tsx:17-24` — `siteUrl()` derives origin from request headers; used for metadata and blocks static/ISR behavior.
- `app/skills/[slug]/page.tsx` — already uses an env-based approach correctly (reference implementation).
- `app/collections/[slug]/page.tsx:41-46` — duplicate `siteOrigin()` logic; should be consolidated with a single shared helper.

## Proposed Solutions
### Option A: Env-only `getSiteUrl()` + ISR on homepage
- Pros: Removes header injection surface; enables ISR; one source of truth for canonical URLs across pages.
- Cons: Requires `NEXT_PUBLIC_SITE_URL` (or equivalent) to be set correctly in all environments.
- Effort: Small

## Acceptance Criteria
- [ ] Homepage uses ISR (e.g. `export const revalidate = 60`)
- [ ] All site URLs come from `NEXT_PUBLIC_SITE_URL` env var
- [ ] No request headers used for URL construction
