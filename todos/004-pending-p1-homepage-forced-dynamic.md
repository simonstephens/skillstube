---
status: pending
priority: p1
issue_id: 004
tags: [code-review, performance]
---

# Homepage forced dynamic + heavy DB usage (headers + full skills fetch for JSON-LD)

## Problem Statement
The homepage calls `headers()`, which opts the entire route out of ISR. Every visit runs four database queries (`getAllSkills`, `getRecentSkills`, `getFeaturedCollections`, `getCollectionSkillCountsByCollectionId`). The homepage should be among the fastest pages. Root cause overlaps with header-based `siteUrl()` (see issue 002). Additionally, `getAllSkills()` runs only to populate JSON-LD counts/names, which is wasteful.

## Findings
- `app/page.tsx` — uses `headers()` via `siteUrl()`, forcing dynamic rendering.
- `app/page.tsx` — `getAllSkills()` used for JSON-LD; full skill list is heavier than needed for slug/name metadata.

## Proposed Solutions
### Option A: Env site URL + revalidate + minimal JSON-LD query
- Pros: Restores ISR; reduces DB load to revalidation windows; smaller query for JSON-LD improves latency and DB cost.
- Cons: Requires new query/helper and env configuration; JSON-LD must stay in sync with what “all skills” means for SEO.
- Effort: Small (much of it covered by fixing issue 002)

## Acceptance Criteria
- [ ] Homepage is ISR-cached (e.g. `export const revalidate = 60`)
- [ ] DB queries for the homepage run only on revalidation (not on every anonymous request)
- [ ] Homepage serves from cache in under 100ms (target when cache is warm)
- [ ] JSON-LD uses a minimal query (e.g. `getSkillSlugsAndNames()` or equivalent) instead of full `getAllSkills()` where appropriate
