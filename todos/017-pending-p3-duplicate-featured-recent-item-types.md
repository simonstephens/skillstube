---
status: pending
priority: p3
issue_id: "017"
tags: [code-review, typescript, dry]
---

# Duplicate FeaturedItem / RecentItem union types

## Problem Statement
`FeaturedItem` in `FeaturedPicks.tsx` and `RecentItem` in `JustAdded.tsx` are identical discriminated unions. Should be a single shared type.

## Proposed Solutions
1. Export one type (e.g. `HomeFeedItem`) from `lib/types.ts` and import in both sections + `app/page.tsx`

## Technical Details
- `components/sections/FeaturedPicks.tsx` lines 12-14
- `components/sections/JustAdded.tsx` lines 10-12

## Acceptance Criteria
- [ ] Single shared type used by both sections and page.tsx
