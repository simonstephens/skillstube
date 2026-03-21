---
status: pending
priority: p2
issue_id: 012
tags: [code-review, performance]
---

# Browse page has no ISR / revalidation

## Problem Statement
`app/browse/page.tsx` does not export a `revalidate` (or related caching) value, so every visit can trigger a fresh database query instead of serving a cached result for a short TTL.

## Findings
- No `export const revalidate` on the browse page.

## Proposed Solutions
### Option A: Time-based revalidation
- Add `export const revalidate = 60` (or another agreed TTL) so the page can be statically regenerated with periodic freshness.
- Effort: Small (one line plus verification)

## Acceptance Criteria
- [ ] Browse route exports an appropriate `revalidate` constant
- [ ] Stale content window is acceptable for product requirements
- [ ] DB load under normal traffic is reduced compared to fully dynamic per-request fetches
