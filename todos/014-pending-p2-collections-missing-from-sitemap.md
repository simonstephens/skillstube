---
status: pending
priority: p2
issue_id: "014"
tags: [code-review, seo, discoverability]
---

# /collections page missing from sitemap

## Problem Statement
The new `/collections` listing page is not included in `app/sitemap.ts`. Crawlers and agents using the sitemap as their discovery source won't find this page.

## Findings
- `app/sitemap.ts` static routes are only `/` and `/browse`
- Collection detail pages (`/collections/[slug]`) are included via `getAllCollectionSlugs()`
- The listing page `/collections` is missing

## Proposed Solutions
1. Add `/collections` to the `staticRoutes` array in `app/sitemap.ts`

## Technical Details
- File: `app/sitemap.ts`

## Acceptance Criteria
- [ ] `/collections` appears in generated sitemap
