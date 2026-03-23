---
status: pending
priority: p3
issue_id: "019"
tags: [code-review, dry, typescript]
---

# Duplicated merge/sort pattern in app/page.tsx

## Problem Statement
`featuredItems` and `recentItems` in `app/page.tsx` repeat the same plugin/skill mapping pattern with different sort keys. A small helper would reduce ~15-20 LOC and centralize serialization.

## Proposed Solutions
1. Extract `mergePluginAndSkillItems(plugins, skills, sortBy, limit)` helper in the same file

## Technical Details
- `app/page.tsx` lines 72-104

## Acceptance Criteria
- [ ] Single merge function handles both featured and recent item lists
