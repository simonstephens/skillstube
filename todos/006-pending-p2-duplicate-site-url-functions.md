---
status: pending
priority: p2
issue_id: 006
tags: [code-review, quality]
---

# Duplicate site URL helpers

## Problem Statement
Three different implementations of site base URL logic (`siteUrl`, `getSiteUrl`, `siteOrigin`) are scattered across the codebase, increasing drift risk and maintenance cost.

## Findings
- `app/page.tsx` lines 17–24
- `app/skills/[slug]/page.tsx` lines 22–29
- `app/collections/[slug]/page.tsx` lines 41–46
- `app/sitemap.ts` line 4

## Proposed Solutions
### Option A: Centralize in `lib/site-url.ts`
- Extract a single `getSiteUrl()` (or equivalent) used by all call sites.
- Effort: Small

## Acceptance Criteria
- [ ] One canonical implementation lives in `lib/site-url.ts`
- [ ] All listed files import and use it; duplicated inline logic is removed
- [ ] Canonical URLs and sitemap behavior unchanged in dev and production
