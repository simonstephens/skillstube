---
status: pending
priority: p2
issue_id: 011
tags: [code-review, performance]
---

# Over-fetching `skillMdContent` on browse

## Problem Statement
`getAllSkills()` selects all columns, including large `skillMdContent` (up to ~50KB per skill). The browse page passes this to a client component as part of the RSC payload, inflating response size (e.g. ~1MB+ for 25 skills) when cards only need a subset of fields.

## Findings
- `getAllSkills()` uses `SELECT *` (or equivalent) including `skillMdContent`.
- Browse page ships unnecessary payload to `SkillCard` (or parent tree).

## Proposed Solutions
### Option A: Narrow query for card lists
- Introduce `getAllSkillCards()` (or similar) selecting only columns required by `SkillCard`; use it on the browse page.
- Effort: Small

## Acceptance Criteria
- [ ] Browse listing uses a query that omits `skillMdContent` and other unused columns
- [ ] Card UI and metadata match prior behavior
- [ ] RSC payload size is measurably reduced for the browse route
