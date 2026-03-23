---
status: pending
priority: p3
issue_id: "016"
tags: [code-review, cleanup, typescript]
---

# Unused TRUST_TIER_META imports in card components

## Problem Statement
`TRUST_TIER_META` is imported but never used in `FeaturedPicks.tsx`, `PluginCard.tsx`, and `SkillCard.tsx`.

## Proposed Solutions
1. Remove unused imports from all three files

## Technical Details
- `components/sections/FeaturedPicks.tsx` line 9
- `components/ui/PluginCard.tsx` line 8
- `components/ui/SkillCard.tsx` line 8

## Acceptance Criteria
- [ ] No unused imports in these files
